import { ethers } from "hardhat";
import { MyERC20Token, MyERC20Token__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const provider = new ethers.providers.EtherscanProvider(
    "goerli",
    process.env.ETHERSCAN_API_KEY
  );

  const privateKey = process.env.PRIVATE_KEY;
  console.log(await provider.getBlock("latest"));

  const wallet = new ethers.Wallet(privateKey as string);
  console.log(`Connected to the wallet address ${wallet.address}`);

  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(`Amount of Goerli Eth: ${ethers.utils.formatEther(balance)} Eth`);

  let myERC20Contract: MyERC20Token;
  const myERC20ContratFactory = new MyERC20Token__factory(signer);

  myERC20Contract = await myERC20ContratFactory.deploy();
  const deployTxReceipt = await myERC20Contract.deployTransaction.wait();

  console.log(
    `The MyERC20 Contract was deployed at the address ${myERC20Contract.address}`
  );

  console.log({ deployTxReceipt });
}

main().catch((err) => {
  console.log(err);
  process.exitCode = 1;
});
