import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const signers = await ethers.getSigners();
  const signer = signers[0];
  console.log(`Signer address: ${signer.address}`);

  const myTCF = await ethers.getContractFactory("MyERC20Token");
  const myTC = await myTCF.deploy();
  const deployTxReceipt = await myTC.deployTransaction.wait();
  console.log(
    `token deployed at ${myTC.address} at block ${deployTxReceipt.blockNumber}`
  );

  const contractName = await myTC.name();
  const contractSymbol = await myTC.symbol();
  let totalSupply = await myTC.totalSupply();
  console.log(
    `contract name is ${contractName}, symbol is ${contractSymbol}, total supply is ${totalSupply}`
  );
  const mintTx = await myTC.mint(signer.address, 10);
  const mintTxReceipt = await mintTx.wait();

  totalSupply = await myTC.totalSupply();
  console.log(
    `mint transaction was complete in block ${mintTxReceipt.blockNumber}. Total supply now stands at ${totalSupply}`
  );
}

main().catch((err) => {
  console.log(err);
  process.exitCode = 1;
});
