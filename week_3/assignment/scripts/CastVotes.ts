import { ethers } from "hardhat";
import { Ballot__factory, MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

// RUN: yarn hardhat run scripts/CastVotes.ts 0 5

async function main() {
  const args = process.argv;
  const proposalAndVote = args.slice(2);

  if (proposalAndVote.length < 2) {
    throw new Error(
      "You must provide proposal array element number and the number of votes"
    );
  }

  const [proposal, vote] = proposalAndVote;

  const privateWalletKey = process.env.PRIVATE_KEY;

  if (!privateWalletKey || privateWalletKey?.length <= 0)
    throw new Error("Missing env: Private key");

  const provider = new ethers.providers.EtherscanProvider(
    "goerli",
    process.env.ETHERSCAN_API_KEY
  );
  const currentBlock = await provider.getBlock("latest");
  console.log(`Current block is ${currentBlock.number}`);

  const wallet = new ethers.Wallet(privateWalletKey);
  console.log(`Connected to the wallet address ${wallet.address}`);

  const signer = wallet.connect(provider);

  const contractFactory = new MyToken__factory(signer);
  const contract = await contractFactory.attach(
    process.env.CONTRACT_ADDRESS as string
  );

  let votePowerSigner = await contract.getVotes(signer.address);

  // Check the historic voting power
  votePowerSigner = await contract.getPastVotes(
    signer.address,
    currentBlock.number - 1
  );
  console.log(
    `Account 1 had a vote power of 
           ${ethers.utils.formatEther(votePowerSigner)} units
           at block ${currentBlock.number - 1}`
  );

  // Attach to existing contract and instantiates it
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = await ballotContractFactory.attach(
    process.env.TOKENIZED_BALLOT_CONTRACT_ADDRESS as string
  );
  await ballotContract.vote(proposal, ethers.utils.parseUnits(vote));

  console.log(
    `Successfully voted:  ${vote} ether equivalent votes to the proposal at position ${proposal}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
