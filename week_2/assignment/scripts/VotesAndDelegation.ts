// Add your script for voting and delegation
import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey || privateKey?.length <= 0)
        throw new Error("Missing env: Private Key");

    const provider = new ethers.providers.EtherscanProvider(
        "goerli",
        process.env.ETHERSCAN_API_KEY
    );

    const wallet = new ethers.Wallet(privateKey);
    console.log(`Connected to the wallet address ${wallet}`);

    const signer = wallet.connect(provider);

    let ballotContract: Ballot;
    const ballotContractFactory = new Ballot__factory(signer);

    // pick the contract address from the spreadsheet and add it to your .env file
    ballotContract = ballotContractFactory.attach(process.env.CONTRACT_ADDRESS as string)

    // Now delegate vote to someone on the team
    await ballotContract.delegate("0x3391fA9045bBb346344a5EC39F89746Ae15a5820");

    // Now cast vote and pass in the proposals array index.
    // This will give an error: Already voted, because my vote is delegated to someone else [line 30].
    await ballotContract.vote(0);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
