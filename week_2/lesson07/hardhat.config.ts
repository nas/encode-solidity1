import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
    console.log(await account.getBalance())
  }
});

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  paths: { tests: "tests" },
};

export default config;
