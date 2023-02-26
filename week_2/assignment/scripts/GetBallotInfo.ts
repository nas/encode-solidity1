// add your script to read various information from Ballot contract

import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey?.length <= 0)
    throw new Error("Missing env: Menomic seed");

  const provider = new ethers.providers.EtherscanProvider(
    "goerli",
    process.env.ETHERSCAN_API_KEY
  );

  const wallet = new ethers.Wallet(privateKey);
  console.log(`Connected to the wallet address ${wallet}`);

  const signer = wallet.connect(provider);

  let ballotContract: Ballot;
  const ballotContractFactory = new Ballot__factory(signer);

  ballotContract = ballotContractFactory.attach(process.env.CONTRACT_ADDRESS as string)
  // pick the contract address from the spreadsheet and add it to your .env file

  // Now give the voting rights here
  const winningProposal = await ballotContract.winningProposal()
  console.log(winningProposal)

  const winnerName = await ballotContract.winnerName()
  console.log(ethers.utils.parseBytes32String(winnerName)) // Output name instead of hash





}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});