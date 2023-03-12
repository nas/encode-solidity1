import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as ballotJson from "./assets/Ballot.json";
import * as dotenv from "dotenv";
dotenv.config();


@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  ballotContract: ethers.Contract;

  constructor() {
    this.provider = new ethers.providers.EtherscanProvider(
      'goerli',
      process.env.ETHERSCAN_API_KEY,
    );

    const privateWalletKey = process.env.PRIVATE_KEY;
    const ballotContractAddress = process.env.TOKENIZED_BALLOT_CONTRACT_ADDRESS;

    if (!privateWalletKey || privateWalletKey?.length <= 0)
      throw new Error("Missing env: Private key");

    const wallet = new ethers.Wallet(privateWalletKey);
    console.log(`Connected to the wallet address ${wallet.address}`);
  
    const signer = wallet.connect(this.provider);


    this.ballotContract = new ethers.Contract(
      ballotContractAddress,
      ballotJson.abi,
      this.provider,
    ); 
  }



  async queryResults() {
    const result = []
    const proposals = []
    
    for (let i = 0; i < 3; i++) {
      const proposal = await this.ballotContract.proposals(i);
      console.log(
        `${
          proposal.voteCount
        } Votes on proposal: ${ethers.utils.parseBytes32String(proposal.name)}`
      );
      proposals.push(ethers.utils.parseBytes32String(proposal));
      await sleep(500); // to avoid hitting api limits
    }
  
    // Finds and Logs the winner
    //console.log("waiting before checking winner");
    //await sleep(1000); // to avoid hitting api limits
    //console.log("checking winner");
    const winner = await this.ballotContract.winnerName();
  
  
    //const targetBlockNumber = await this.ballotContract.targetBlockNumber();
    //console.log({ targetBlockNumber });
  
    //const winnerName = ethers.utils.parseBytes32String(winner);
    //console.log(`The winner is: ${winnerName}`);

    //result.push(proposals)

    return proposals
  }
}
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

