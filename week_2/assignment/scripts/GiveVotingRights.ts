// Add your script for giving voting rights

import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {

  const mnemonic = process.env.MNEMONIC;
  if (!mnemonic || mnemonic?.length <= 0)
    throw new Error("Missing env: Menomic seed");

  const provider = new ethers.providers.EtherscanProvider(
    "goerli",
    process.env.ETHERSCAN_API_KEY
  );

  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  console.log(`Connected to the wallet address ${wallet.address}`);

  const signer = wallet.connect(provider);

  let ballotContract: Ballot;
  const ballotContractFactory = new Ballot__factory(signer);

  ballotContract = ballotContractFactory.attach(process.env.CONTRACT_ADDRESS as string)
  // pick the contract address from the spreadsheet and add it to your .env file

  console.log(await ballotContract.address)
  // Now give the voting rights here

  const f = await ballotContract.giveRightToVote("0xa82C37538661bE12238Ab74930475C009c69824B")

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
