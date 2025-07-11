import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  /**
   * Check that the gateway is up and reachable.
   *
   * @returns A status message from the gateway service
   */
  getData() {
    return this.appService.getData();
  }
}
