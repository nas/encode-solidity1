import { ethers } from "hardhat";
import { MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const MINT_VALUE = ethers.utils.parseEther("10");
  const VOTERS_KEYS = [
    "0x3391fA9045bBb346344a5EC39F89746Ae15a5820",
    "0xa82C37538661bE12238Ab74930475C009c69824B",
    "0xb402E6065224A833a449431ad5f3F1040A9F16e0",
    "0x8d7a68FBd832D321b02b71F3f8c4d5dd642905aA",
    "0xaE18784172f91A7f5549B73DbDA188A940708725",
    "0x22372DF9f4b8CCf0a3A7f6beeb2042576C3C6D4A"]


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
  const balance = await signer.getBalance();

  console.log("Minting new tokens for all");
  const mintingContractFactory = new MyToken__factory(signer);
  
  const mintingContract = await mintingContractFactory.attach(process.env.CONTRACT_ADDRESS as string)
  // const mintingContract = await mintingContractFactory.deploy();
  // const deployTransactionReceipt = await mintingContract.deployTransaction.wait();
  // console.log(`minting contract deployed at: ${deployTransactionReceipt.blockNumber}`)
  for (let i = 0; i < VOTERS_KEYS.length; i++) {
    const mintTx = await mintingContract.mint(VOTERS_KEYS[i], MINT_VALUE);
    const mintTxReceipt = await mintTx.wait();
    console.log(
      `The ${i}th token was minted for 
      ${VOTERS_KEYS[i]} at block 
      ${mintTxReceipt.blockNumber}`);
  console.log(
    `Tokens minted for ${VOTERS_KEYS[i]} at block ${mintTxReceipt.blockNumber}`
  );
  mintingContract.balanceOf(VOTERS_KEYS[i]).then((bal) =>
    console.log(`Voter's Key balance: ${ethers.utils.formatEther(bal)}`)
  )
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})