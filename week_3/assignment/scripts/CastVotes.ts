import { ethers } from "hardhat";
import { Ballot__factory, MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

// RUN: yarn hardhat run scripts/CastVotes.ts

async function main() {
    const privateWalletKey = process.env.PRIVATE_KEY;

    if (!privateWalletKey || privateWalletKey?.length <= 0)
        throw new Error("Missing env: Private key");

    const provider = new ethers.providers.EtherscanProvider(
        "goerli",
        process.env.ETHERSCAN_API_KEY
    );
    const currentBlock = await provider.getBlock("latest")
    console.log(`Current block is ${currentBlock.number}`);

    const wallet = new ethers.Wallet(privateWalletKey);
    console.log(`Connected to the wallet address ${wallet.address}`);

    const signer = wallet.connect(provider);

    const contractFactory = new MyToken__factory(signer);
    const contract = await contractFactory.attach(process.env.CONTRACT_ADDRESS as string);

    let votePowerSigner = await contract.getVotes(signer.address);

    // Check the historic voting power
    votePowerSigner = await contract.getPastVotes(signer.address, currentBlock.number - 1);
    console.log(
        `Account 1 had a vote power of 
           ${ethers.utils.formatEther(votePowerSigner)} units
           at block ${currentBlock.number - 1}`);

    votePowerSigner = await contract.getPastVotes(signer.address, currentBlock.number - 2);
    console.log(
        `Account 1 had a vote power of 
           ${ethers.utils.formatEther(votePowerSigner)} units
           at block ${currentBlock.number - 2}`);

    // Attach to existing contract and instantiates it
    const ballotContractFactory = new Ballot__factory(signer);
    const ballotContract = ballotContractFactory.attach(process.env.CONTRACT_ADDRESS as string);
    await ballotContract.vote(0);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})
