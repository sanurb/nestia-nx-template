import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { TypedRoute } from '@nestia/core';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @TypedRoute.Get()
  getData() {
    return this.appService.getData();
  }
}
