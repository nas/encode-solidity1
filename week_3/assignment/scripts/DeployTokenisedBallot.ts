import { ethers } from "hardhat";
import { Ballot, Ballot__factory, MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
import { tokenizedBalletSol } from "../typechain-types/factories/contracts";
dotenv.config();

// USAGE: ts-node --files scripts/DeployTokenisedBallot.ts Proposal1 Proposal2 Proposal3

function convertStringArrayToBytes32(array: string[]) {
  return array.map((e) => ethers.utils.formatBytes32String(e));
}

async function main() {
  const args = process.argv;
  const proposals = args.slice(2);
  const targetBlockNo = 8606287; // block number at which the ERC20 token was deployed

  const privateWalletKey = process.env.PRIVATE_KEY;

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

  console.log("Deploying TokenisedBallot contract");
  const tokenizedBallotContractFactory = new Ballot__factory(signer);
  const tokenizedBallotContract = await tokenizedBallotContractFactory.deploy(
    convertStringArrayToBytes32(proposals),
    process.env.CONTRACT_ADDRESS as string,
    targetBlockNo
  );
  const deployTxReceipt =
    await tokenizedBallotContract.deployTransaction.wait();

  console.log(
    `The tokenized ballot Contract was deployed at the address ${tokenizedBallotContract.address}`
  );

  console.log({ deployTxReceipt });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
