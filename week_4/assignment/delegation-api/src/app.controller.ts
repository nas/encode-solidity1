import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("delegate")
  async delegate() {
      return await this.appService.delegate();
  }
}

