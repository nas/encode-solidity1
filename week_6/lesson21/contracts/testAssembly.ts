import { expect } from "chai";
import { ethers } from "hardhat";
import { AssemblyTest } from "../typechain-types";
import * as contractJson from "../artifacts/contracts/AssemblyTest.sol/AssemblyTest.json";

function findDiff(str1: string, str2: string) {
  let diff = "";
  str2.split("").forEach(function (val: string, i: number) {
    if (val !== str1.charAt(i)) diff += val;
  });
  return diff;
}

describe("Testing Assembly operations", async () => {
  let testContract: AssemblyTest;

  beforeEach(async () => {
    // First of all: deploy the library
    const getCodeLibraryFactory = await ethers.getContractFactory("GetCode");
    const getCodeLibrary = await getCodeLibraryFactory.deploy();
    await getCodeLibrary.deployed();

    // Secondly: get a contract factory, passing the library address
    const testContractFactory = await ethers.getContractFactory(
      "AssemblyTest",
      { libraries: { GetCode: getCodeLibrary.address } }
    );
    testContract = await testContractFactory.deploy();
    await testContract.deployed();
  });

  it("Returns the correct code", async () => {
    const bytecode = await testContract.getThisCode();
    const diff = findDiff(bytecode, contractJson.deployedBytecode);
    const cleanedDiff = diff.replace(/__(?<=__)(.*?)(?=__)__/g, "");
    expect(cleanedDiff).to.eq("");
  });
});
