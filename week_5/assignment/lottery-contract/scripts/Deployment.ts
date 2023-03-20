import { ethers } from "hardhat";
import { LotteryToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

// USAGE: ts-node --files scripts/Deployment.ts tokenName tokenSymbol

function convertStringArrayToBytes32(array: string[]) {
  return array.map((e) => ethers.utils.formatBytes32String(e));
}

async function main() {
  const args = process.argv;
  const tokenName = args.slice(2, 3);
  const tokenNameStr = tokenName[0];
  const tokenSymbol = args.slice(3, 4);
  const tokenSymbolStr = tokenSymbol[0];

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
  const balance = await signer.getBalance();

  console.log("Deploying ERC20 contract");
  const contractFactory = new LotteryToken__factory(signer);
  const contract = await contractFactory.deploy(tokenNameStr, tokenSymbolStr);
  const deployTxReceipt = await contract.deployTransaction.wait();

  console.log(
    `The Lottery Token was deployed at the address ${contract.address}`
  );

  console.log({ deployTxReceipt });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});