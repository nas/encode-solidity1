import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import {RequestTokenDto} from './dtos/RequestTokens.dto'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('contract-address')
  getContractAddress(): {address: string} {
    return {address: this.appService.getContractAddress()};
  }

  @Get('total-supply')
  getTotalSupply(): Promise<number> {
    return this.appService.getTotalSupply();
  }

  @Get('/allowance/:from/:to')
  getAllowance(
    @Param('from') from: string,
    @Param('to') to: string,
  ): Promise<number> {
    return this.appService.getAllowance(from, to);
  }

  @Get('/transaction-status')
  getTransactionStatus(@Query('hash') hash: string): Promise<string> {
    return this.appService.getTransactionStatus(hash);
  }

  @Post('/request-tokens')
  requestTokens(@Body() body: RequestTokenDto) {
    return {result: this.appService.requestTokens(body.address, body.amount) }
  }

}
