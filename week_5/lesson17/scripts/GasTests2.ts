import { ethers } from "hardhat";
import { Gas } from "../typechain-types"

const TEST_VALUE = 1000 
async function compareLocations() {
  const gasContractFactory = await ethers.getContractFactory("Gas");
  let contract: Gas = await gasContractFactory.deploy();
  contract = await contract.deployed();
  const testTx1 = await contract.updateNumber(TEST_VALUE);
  const testTx1Receipt = await testTx1.wait();
  console.log(
    `Used ${testTx1Receipt.gasUsed} gas units in storage and local reads test function`
  );
  const testTx2 = await contract.updateNumberOptimized(TEST_VALUE);
  const testTx2Receipt = await testTx2.wait();
  console.log(
    `Used ${testTx2Receipt.gasUsed} gas units in optimized state and local reads test function`
  );
}

compareLocations().catch(error => {
  console.error(error)
  process.exitCode = 1
});