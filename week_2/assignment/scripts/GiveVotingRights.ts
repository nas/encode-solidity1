// Add your script for giving voting rights

import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {

  const args = process.argv
  const address = args.slice(2)[0];

  if (!address)
    throw new Error("Missing address parameter for voting rights");
  
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey?.length <= 0)
    throw new Error("Missing env: Private Key");

  const provider = new ethers.providers.EtherscanProvider(
    "goerli",
    process.env.ETHERSCAN_API_KEY
  );

  const wallet = new ethers.Wallet(privateKey);
  console.log(`Connected to the wallet address ${wallet.address}`);

  const signer = wallet.connect(provider);

  let ballotContract: Ballot;
  const ballotContractFactory = new Ballot__factory(signer);

  ballotContract = ballotContractFactory.attach(process.env.CONTRACT_ADDRESS as string)
  // pick the contract address from the spreadsheet and add it to your .env file

  console.log(await ballotContract.address)
  // Now give the voting rights here

  const f = await ballotContract.giveRightToVote(address)
  console.log(f)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
