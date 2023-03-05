import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const args = process.argv;
  const proposals = args.slice(2);

  const privateWalletKey = process.env.PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;

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
  const ballotContract = ballotContractFactory.attach(contractAddress);

  // Checks the winner
  const winnerAddress = await ballotContract.winnerName();
  const winnerName = ethers.utils.parseBytes32String(winnerAddress)
  console.log(`The winner is: ${winnerName}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});