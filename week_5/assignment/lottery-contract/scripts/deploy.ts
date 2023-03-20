
import { ethers } from "hardhat";
import { Lottery, Lottery__factory} from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

// USAGE: ts-node --files scripts/deploy.ts

const BET_PRICE = 0.01;
const BET_FEE = 0.002;
const TOKEN_RATIO = 100;
let contract: Lottery;

async function main() {
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
  const contractFactory = new Lottery__factory(signer);

  console.log("Deploying Lottery contract");
  contract = await contractFactory.deploy(
    "LotteryToken",
    "LT0",
    TOKEN_RATIO,
    ethers.utils.parseEther(BET_PRICE.toFixed(18)),
    ethers.utils.parseEther(BET_FEE.toFixed(18))
  );
  const deployReceipt = await contract.deployTransaction.wait();
  console.log({deployReceipt})

  console.log(
    `The Lottery Contract was deployed at the address ${contract.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
