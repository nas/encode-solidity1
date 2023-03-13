import { ethers } from "hardhat";
import { Gas } from "../typechain-types"

async function comparePacking() {
  const gasContractFactory = await ethers.getContractFactory("Gas");
  let contract: Gas = await gasContractFactory.deploy();
  contract = await contract.deployed();
  const testTx1 = await contract.createUnpacked();
  const testTx1Receipt = await testTx1.wait();
  console.log(
    `Used ${testTx1Receipt.gasUsed} gas units in struct packing test function`
  );
  const testTx2 = await contract.createPacked();
  const testTx2Receipt = await testTx2.wait();
  console.log(
    `Used ${testTx2Receipt.gasUsed} gas units in optimized struct packing test function`
  );
}

comparePacking().catch(error => {
  console.error(error)
  process.exitCode = 1
});