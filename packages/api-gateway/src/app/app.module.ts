import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: process.env.GATEWAY_ENV_PATH || '.env' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
