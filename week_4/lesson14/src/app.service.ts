import { BadRequestException, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';
import { CreatePaymentOrderDto } from './dtos/createPaymentOrder.dto';
import { UpdatePaymentOrderDto } from './dtos/updatePaymentOrder.dto';
import { PaymentOrder } from './models/paymentOrder.models';

const CONTRACT_ADDRESS = '0x040f665db55e939e35e1abd684965f5184014aa9';

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  contract: ethers.Contract;

  paymentOrders: PaymentOrder[];

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
    this.paymentOrders = [];
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

  getPaymentOrders() {
    return this.paymentOrders;
  }

  async createPaymentOrder(body: CreatePaymentOrderDto) {
    this.paymentOrders.push({
      id: this.paymentOrders.length,
      ...body,
    });
  }

  async fulfillPaymentOrder(body: UpdatePaymentOrderDto) {
    const { id, secret, address } = body;
    const paymentOrder = this.paymentOrders.find((e) => e.secret === secret);
    if (!paymentOrder)
      throw new BadRequestException('payment order not present');

    if (paymentOrder.id !== id)
      throw new BadRequestException('wrong id provided');

    const privateKey = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey as string);
    const signer = wallet.connect(this.provider);

    const txReceipt = await this.contract
      .connect(signer)
      .mint(address, ethers.utils.parseEther(paymentOrder.value.toString()));

    await txReceipt.wait();

    return txReceipt;
  }
}
