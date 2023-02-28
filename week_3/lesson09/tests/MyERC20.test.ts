import { ethers } from "hardhat";
import { MyERC20Token } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";

describe("Basic ERC20 test", async () => {
  let myTC: MyERC20Token;
  let signers: SignerWithAddress[];

  beforeEach(async () => {
    signers = await ethers.getSigners();
    const myTCF = await ethers.getContractFactory("MyERC20Token");
    myTC = await myTCF.deploy();
    await myTC.deployTransaction.wait();
    const mintTx = await myTC.mint(signers[0].address, 1000);
    await mintTx.wait();
  });

  it("should have zero total supply", async () => {
    const totalSupply = await myTC.totalSupply();
    expect(totalSupply).to.eq(1000);
  });

  it("triggers the Transfer event with the address of the sender when sending transactions", async () => {
    await expect(myTC.transfer(signers[1].address, 10))
      .to.emit(myTC, "Transfer")
      .withArgs(signers[0].address, signers[1].address, 10);
  });
});
