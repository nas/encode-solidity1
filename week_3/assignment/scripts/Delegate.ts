import { ethers } from "hardhat";
import { MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

// USAGE: ts-node --files scripts/Delegate.ts

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

  const contractFactory = new MyToken__factory(signer);

  const contract = await contractFactory.attach(process.env.CONTRACT_ADDRESS as string)

   //check voting power
   let votePowerAccount1 = await contract.getVotes(signer.address);

   console.log(
     `Your Account has voting power of ${ethers.utils.formatEther(
       votePowerAccount1
     )}`
   );
 
   const delegateTx = await contract
     .connect(signer)
     .delegate(signer.address);
   const delegateTxReceipt = await delegateTx.wait();
  //  console.log({delegateTxReceipt})
 
   votePowerAccount1 = await contract.getVotes(signer.address);

   // confirm updating voting power. It should not be 0.0 anymore
   console.log(
     `After delegation: Your Account has voting power of ${ethers.utils.formatEther(
       votePowerAccount1
     )}`
   );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})