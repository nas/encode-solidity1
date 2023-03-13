import { Controller, Get, Post, Body, Query, Patch } from '@nestjs/common';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("query-results")
  async queryResults() {
      return await this.appService.queryResults();
  }

  @Patch("request-voting")
  async requestVoting(
    @Query('address') address: string,
    @Query('value') value: string
  ) {
    return await this.appService.requestVoting(address, value)
  }

  @Get("get-balance")
  async getBalance(
    @Query('address') address: string,
  ) {
    return await this.appService.getBalance(address)
  }
}

