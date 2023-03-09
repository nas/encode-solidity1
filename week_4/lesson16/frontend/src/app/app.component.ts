import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ethers, Wallet, utils, Contract, BigNumber } from 'ethers';
import tokenJson from '../assets/MyToken.json'

const API_URL="http://localhost:3008/contract-address";
const MINT_URL="http://localhost:3008/request-tokens";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  blockNumber: number | string | undefined= 0
  provider: ethers.providers.BaseProvider;
  userWallet: Wallet | undefined;
  userEthBalance: number| undefined;
  userTokenBalance: number | undefined;
  tokenContractAddress: string | undefined;
  tokenContract: Contract | undefined;
  tokenTotalSupply: number | string | undefined;


  constructor(private http: HttpClient) {
    this.provider = ethers.getDefaultProvider('goerli');
  }

  getTokenAddress() {
    return this.http.get<{address: string}>(API_URL)
  }

  syncBlock() {
    this.blockNumber = 'loading....'
    this.provider.getBlock('latest').then(block => {
      this.blockNumber = block.number;
      this.getTokenAddress().subscribe(response => {
        this.tokenContractAddress = response.address;
      })
    })
  } 

  updateTokenInfo() {
    this.tokenTotalSupply = "Loading...."
    this.tokenContract = new ethers.Contract(this.tokenContractAddress ?? "", tokenJson.abi, this.userWallet ?? this.provider);
    this.tokenContract['tokenSupply'].then((totalSupplyBN: BigNumber) => {
      const totalSupplyStr = utils.formatEther(totalSupplyBN);
      this.tokenTotalSupply = parseFloat(totalSupplyStr)
    })
  }

  createWallet() {
    this.userWallet = Wallet.createRandom().connect(this.provider)
    this.userWallet.getBalance().then(balanceBN => {
      const balanceStr = utils.formatEther(balanceBN)
      this.userEthBalance = parseFloat(balanceStr)
    })
  }

  clear() {
    this.blockNumber = 0
  } 

  requestTokens(amount: string) {
    const body = { address: this.userWallet?.address, amount: amount}
    return this.http.post<{result: string}>(MINT_URL,body).subscribe(result => {
      console.log(`Requested ${amount} for tthe ${this.userWallet?.address}`)
    })
  }
}
