import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  /**
   * Retrieve a basic status message.
   *
   * @returns A simple object confirming the service is running
   */
  getData() {
    return this.appService.getData();
  }
}
