import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json'; // TODO
import { Lottery } from '../lottery-contract/contracts/Lottery.sol'; // Not sure why the error
import * as dotenv from "dotenv";
import { StartLotteryDto } from './dtos/startLottery.dto';
dotenv.config();

// TODO: need a new deployed contract address
const CONTRACT_ADDRESS = '' // old address '0x040f665db55e939e35e1abd684965f5184014aa9';

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  contract: ethers.Contract;
  lottery: Lottery;

  constructor() {
    this.provider = new ethers.providers.EtherscanProvider(
      'goerli',
      process.env.ETHERSCAN_API_KEY,
    );

    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      tokenJson.abi, // TODO
      this.provider,
    )
  }

  startLottery(body: StartLotteryDto) {
    this.lottery = new Lottery(body);
  }

  async closeLottery() {
    await this.contract.connect(this.provider)
      .attach(CONTRACT_ADDRESS)
      .closeLottery();
  }
}