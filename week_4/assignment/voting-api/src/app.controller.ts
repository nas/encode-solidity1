import { Controller, Get, Post, Body, Query, Patch, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestVotingDto } from './dtos/RequestVoting.dto';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("query-results")
  async queryResults() {
      return await this.appService.queryResults();
  }

  @Patch("request-voting")
  async requestVoting(
    @Body() body: RequestVotingDto
  ) {
    return await this.appService.requestVoting(body.address, body.amount)
  }

  @Get("get-balance")
  async getBalance(
    @Query('address') address: string,
  ) {
    return await this.appService.getBalance(address)
  }
}

