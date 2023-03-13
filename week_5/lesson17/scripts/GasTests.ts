import { ethers } from "hardhat";
import config from "../hardhat.config"
import { Gas } from "../typechain-types"

const TEST_VALUE = 1000
async function compareDeploy() {
  const userSettings = config?.solidity as any;
  console.log(
    `Using ${userSettings.settings?.optimizer.runs} runs optimization`
  );
  const gasContractFactory = await ethers.getContractFactory("Gas");
  let contract: Gas = await gasContractFactory.deploy();
  contract = await contract.deployed();
  const deployTxReceipt = await contract.deployTransaction.wait();
  console.log(`Used ${deployTxReceipt.gasUsed} gas units in deployment`);
  const testTx = await contract.loopActions(TEST_VALUE);
  const testTxReceipt = await testTx.wait();
  console.log(`Used ${testTxReceipt.gasUsed} gas units in test function`);
}

compareDeploy().catch(error => {
  console.error(error)
  process.exitCode = 1
});