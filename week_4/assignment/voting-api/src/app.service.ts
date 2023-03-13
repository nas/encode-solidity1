import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as ballotJson from "./assets/Ballot.json";
import * as myTokenJson from "./assets/MyToken.json";
import * as dotenv from "dotenv";
dotenv.config();

type Proposal = {
  name: string,
  votes: string
}

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  ballotContract: ethers.Contract;
  mintingContract: ethers.Contract

  constructor() {
    this.provider = new ethers.providers.EtherscanProvider(
      'goerli',
      process.env.ETHERSCAN_API_KEY,
    );

    const privateWalletKey = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateWalletKey);
    const signer = wallet.connect(this.provider);

    const ballotContractAddress = process.env.TOKENIZED_BALLOT_CONTRACT_ADDRESS;
    this.ballotContract = new ethers.Contract(
      ballotContractAddress,
      ballotJson.abi,
      this.provider,
    ); 

    const mintingContractAddress = process.env.CONTRACT_ADDRESS
    this.mintingContract = new ethers.Contract(
      mintingContractAddress,
      myTokenJson.abi,
      signer,
    ); 
  }

  async queryResults() {
    const result: {proposals?: Proposal[], winner?: string} = {}
    const proposals: Proposal[] = []
    
    for (let i = 0; i < 3; i++) {
      const proposal = await this.ballotContract.proposals(i);
      console.log(
        `${
          proposal.voteCount
        } Votes on proposal: ${ethers.utils.parseBytes32String(proposal.name)}`
      );
      proposals.push({
       name: ethers.utils.parseBytes32String(proposal.name),
       votes: `${ethers.utils.formatUnits(proposal.voteCount.toString())} ETH`
      });
    }
  
    const winner = await this.ballotContract.winnerName();
    const winnerName = ethers.utils.parseBytes32String(winner);

    result.proposals = proposals;
    result.winner = winnerName;

    return result;
  }

  async requestVoting(address: string, value: string){
    await this.mintingContract.mint(address, value);

    return this.mintingContract.balanceOf(address).then((bal) => ethers.utils.formatEther(bal))
  }

  async getBalance(address: string){
    return this.mintingContract.balanceOf(address).then((bal) => ethers.utils.formatEther(bal))
  }

}

