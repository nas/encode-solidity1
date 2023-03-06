import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const args = process.argv;
  const addresses = args.slice(2); // if addresses are provided on the command line then find their voting power

  const privateWalletKey = process.env.PRIVATE_KEY;
  const contractAddress = process.env.TOKENIZED_BALLOT_CONTRACT_ADDRESS;

  if (!privateWalletKey || privateWalletKey?.length <= 0)
    throw new Error("Missing env: Private key");

  const provider = new ethers.providers.EtherscanProvider(
    "goerli",
    process.env.ETHERSCAN_API_KEY
  );
  console.log(await provider.getBlock("latest"));

  const wallet = new ethers.Wallet(privateWalletKey);
  console.log(`Connected to the wallet address ${wallet.address}`);

  const signer = wallet.connect(provider);

  // Attach to existing contract and instantiates it
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = await ballotContractFactory.attach(
    contractAddress as string
  );

  for (let i = 0; i < 3; i++) {
    const proposal = await ballotContract.proposals(i);
    console.log(
      `${
        proposal.voteCount
      } Votes on proposal: ${ethers.utils.parseBytes32String(proposal.name)}`
    );
    await sleep(500); // to avoid hitting api limits
  }

  // Finds and Logs the winner
  console.log("waiting before checking winner");
  await sleep(1000); // to avoid hitting api limits
  console.log("checking winner");
  const winnerAddress = await ballotContract.winnerName();

  if (addresses.length > 0) {
    addresses.forEach(async (address) => {
      const votingPower = await ballotContract.votingPower(address);
      console.log(`Voting Power for the address ${address}: ${votingPower}`);
      await sleep(500); // to avoid hitting api limits
    });
  } else {
    console.log(
      "To find the voting power of an address, provide them as args on the command line"
    );
  }

  const targetBlockNumber = await ballotContract.targetBlockNumber();
  console.log({ targetBlockNumber });

  const winnerName = ethers.utils.parseBytes32String(winnerAddress);
  console.log(`The winner is: ${winnerName}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
