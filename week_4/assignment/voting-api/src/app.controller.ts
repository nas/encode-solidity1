import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("query-results")
  async queryResults() {
      return await this.appService.queryResults();
  }
}

