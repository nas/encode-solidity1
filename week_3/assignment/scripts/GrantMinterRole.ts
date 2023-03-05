import { ethers } from "hardhat";
import { MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {

  const args = process.argv;

  // takes only one address from the console
  const accountAddressParam = args.slice(2,3)

  if (accountAddressParam.length <= 0)
    throw new Error("Missing parameters for account address");

  // extracts first arg provided from the console
  const accountAddress = accountAddressParam[0]

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

  const mintingContractFactory = new MyToken__factory(signer);

  console.log(`Assigning minter role to: ${accountAddress}`)
  const mintingContract = await mintingContractFactory.attach(process.env.CONTRACT_ADDRESS as string)

  // assign minter role to the address
  const mintTx = await mintingContract.grantRole(mintingContract.MINTER_ROLE(), accountAddress);
  const mintTxReceipt = await mintTx.wait();
  console.log({mintTxReceipt})

  const accountRole = await mintingContract.hasRole(mintingContract.MINTER_ROLE(), accountAddress)
  console.log(`${accountAddress} has MINTER ROLE`, accountRole)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})