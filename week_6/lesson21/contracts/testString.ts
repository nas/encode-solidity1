import { expect } from "chai";
import { ethers } from "hardhat";
import { StringUtilsTest } from "../typechain-types";

const STRING_A = "Pen";
const STRING_B = "Apple";
const STRING_C = "Pineapple";

describe("Testing String operations", async () => {
  let testContract: StringUtilsTest;

  before(async () => {
    const testContractFactory = await ethers.getContractFactory(
      "StringUtilsTest"
    );
    testContract = await testContractFactory.deploy();
    await testContract.deployed();
  });

  describe("Saving first value", async () => {
    let savedString1: string;
    before(async () => {
      const tx = await testContract.concatenateAndSaveUsingAbiEncode(
        STRING_B,
        STRING_A
      );
      console.log({ STRING_A, STRING_B });
      const receipt = await tx.wait();
      console.log(
        `Concat and save transaction using ABI Encode method spend ${receipt.gasUsed} gas units`
      );
      savedString1 = await testContract.stored1();
      console.log(savedString1);
    });
    it(`Saves ${STRING_B}${STRING_A} in the contract`, async () => {
      expect(savedString1).to.eq(`${STRING_B}${STRING_A}`);
    });
    describe("Saving second value", async () => {
      let savedString2: string;
      before(async () => {
        const tx = await testContract.concatenateAndSaveUsingLibrary(
          STRING_C,
          STRING_A
        );
        console.log({ STRING_A, STRING_C });
        const receipt = await tx.wait();
        console.log(
          `Concat and save transaction using Library method spend ${receipt.gasUsed} gas units`
        );
        savedString2 = await testContract.stored2();
        console.log(savedString2);
      });
      it(`Saves ${STRING_C}${STRING_A} in the contract`, async () => {
        expect(savedString2).to.eq(`${STRING_C}${STRING_A}`);
      });
      describe("Saving comparison results with ABI Encode", async () => {
        before(async () => {
          const tx = await testContract.compareAndSaveUsingAbiEncode();
          const receipt = await tx.wait();
          console.log(
            `Compare and save transaction using ABI Encode method spend ${receipt.gasUsed} gas units`
          );
        });
        it(`Saves the comparison value in the contract`, async () => {
          const stringsEqual = await testContract.stringsEqual();
          expect(stringsEqual).to.eq(savedString1 === savedString2);
        });
        describe("Saving comparison results with Library", async () => {
          before(async () => {
            const tx = await testContract.compareAndSaveUsingLibrary();
            const receipt = await tx.wait();
            console.log(
              `Compare and save transaction using Library method spend ${receipt.gasUsed} gas units`
            );
          });
          it(`Saves the comparison value in the contract`, async () => {
            const stringsEqual = await testContract.stringsEqual();
            expect(stringsEqual).to.eq(savedString1 === savedString2);
          });
          describe("Grand finale", async () => {
            before(async () => {
              console.log(savedString1);
              let tx = await testContract.concatenateAndSaveUsingAbiEncode(
                STRING_A,
                STRING_C
              );
              await tx.wait();
              console.log(savedString2);
              const lastSavedStr = await testContract.stored1();
              tx = await testContract.concatenateAndSaveUsingAbiEncode(
                lastSavedStr,
                savedString1
              );
              await tx.wait();
              tx = await testContract.concatenateAndSaveUsingLibrary(
                lastSavedStr,
                savedString1
              );
              await tx.wait();
              const finalString = await testContract.stored1();
              console.log(finalString);
              tx = await testContract.compareAndSaveUsingLibrary();
              await tx.wait();
            });
            it(`Saves the comparison value in the contract`, async () => {
              const stringsEqual = await testContract.stringsEqual();
              expect(stringsEqual).to.eq(true);
            });
          });
        });
      });
    });
  });
});
