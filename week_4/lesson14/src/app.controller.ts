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
import { CreatePaymentOrderDto } from './dtos/createPaymentOrder.dto';
import { UpdatePaymentOrderDto } from './dtos/updatePaymentOrder.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('contract-address')
  getContractAddress(): string {
    return this.appService.getContractAddress();
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

  @Get('/payment-orders')
  getPaymentOrders() {
    return this.appService.getPaymentOrders();
  }

  @Post('/payment-orders')
  createPaymentOrder(@Body() body: CreatePaymentOrderDto) {
    return this.appService.createPaymentOrder(body);
  }

  @Patch('/fulfill-payment-order')
  fulfillPaymentOrder(@Body() body: UpdatePaymentOrderDto) {
    return this.appService.fulfillPaymentOrder(body);
  }
}
