import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';

const CONTRACT_ADDRESS = '0x040f665db55e939e35e1abd684965f5184014aa9';

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.providers.EtherscanProvider(
      'goerli',
      process.env.ETHERSCAN_API_KEY,
    );

    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      tokenJson.abi,
      this.provider,
    );
  }

  getContractAddress(): string {
    return CONTRACT_ADDRESS;
  }

  async getTotalSupply(): Promise<number> {
    const totalSupplyBN = await this.contract.totalSupply();
    const totalSupplyString = ethers.utils.formatEther(totalSupplyBN);
    return parseFloat(totalSupplyString);
  }

  async getAllowance(from: string, to: string): Promise<number> {
    const allowanceBN = await this.contract.allowance(from, to);
    const allowanceString = ethers.utils.formatEther(allowanceBN);
    return parseFloat(allowanceString);
  }

  async getTransactionStatus(hash: string): Promise<string> {
    const txnHash = await this.provider.getTransaction(hash);
    const txnReceipt = await txnHash.wait();
    return txnReceipt.status === 1 ? 'Completed' : 'Reverted';
  }

  requestTokens(address: string, amount: number) {
    // Load pkey from env
    // create  a signer
    // connecthe signer to the contract
    // call the mind function

  }

}
