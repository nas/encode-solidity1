import { Injectable } from '@nestjs/common';
import { BigNumber, ethers } from 'ethers';
import * as ballotJson from "./assets/Ballot.json";
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

  constructor() {
    this.provider = new ethers.providers.EtherscanProvider(
      'goerli',
      process.env.ETHERSCAN_API_KEY,
    );

    const ballotContractAddress = process.env.TOKENIZED_BALLOT_CONTRACT_ADDRESS;

    this.ballotContract = new ethers.Contract(
      ballotContractAddress,
      ballotJson.abi,
      this.provider,
    ); 
  }

  async delegate() {
    const delegateTx = await this.ballotContract.connect(
      this.provider).delegate(this.provider.lookupAddress);
    const delegateTxReceipt = await delegateTx.wait();

    let votePowerAccount1 = await this.ballotContract.getVotes(
      this.provider.lookupAddress);
    
    const result: {votePower?: BigNumber} = {};
    // const proposals: Proposal[] = []
    
    result.votePower = votePowerAccount1;
    return result;

  }
}

