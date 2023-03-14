import { ethers } from "hardhat";
import words from "random-words";
import { SortedBallot } from "../typechain-types";

const HARDCODED_SAFE_LOOP_LIMIT = 1000;
const BLOCK_GAS_LIMIT = 30000000;

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  const ballotFactory = await ethers.getContractFactory("SortedBallot");
  let wordCount = 100;
  try {
    for (let loop = 0; loop < HARDCODED_SAFE_LOOP_LIMIT; loop++) {
      console.log(`Loop ${loop}: Testing with ${wordCount} words`);
      const proposals = words({ exactly: wordCount });
      const ballotContract: SortedBallot = await ballotFactory.deploy(
        convertStringArrayToBytes32(proposals)
      );
      await ballotContract.deployed();
      console.log("Sorting proposals");
      const sortTx = await ballotContract.sortProposals();
      console.log("Awaiting confirmations");
      const sortReceipt = await sortTx.wait();
      console.log("Completed");
      const percentUsed = sortReceipt.gasUsed
        .mul(100)
        .div(BLOCK_GAS_LIMIT)
        .toNumber();
      console.log(
        `${sortReceipt.gasUsed} units of gas used at ${ethers.utils.formatUnits(
          sortReceipt.effectiveGasPrice,
          "gwei"
        )} GWEI effective gas price, total of ${ethers.utils.formatEther(
          sortReceipt.effectiveGasPrice.mul(sortReceipt.gasUsed)
        )} ETH spent. This used ${percentUsed} % of the block gas limit`
      );
      const props = [];
      for (let index = 0; index < wordCount; index++) {
        const prop = await ballotContract.proposals(index);
        props.push(ethers.utils.parseBytes32String(prop.name));
      }
      console.log(`Passed ${wordCount} proposals:`);
      console.log(proposals.join(", "));
      console.log("Sorted proposals: ");
      console.log(props.join(", "));
      wordCount +=
        percentUsed > 95
          ? 1
          : percentUsed > 90
          ? 2
          : percentUsed > 75
          ? 10
          : percentUsed > 50
          ? 25
          : percentUsed > 30
          ? 30
          : 100;
    }
  } catch (error) {
    console.log(
      `Congratulations! You broke the block limit while sorting ${wordCount} words in a Smart Contract`
    );
    console.log({ error });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});