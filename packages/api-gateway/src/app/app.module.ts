import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtMiddleware } from './jwt.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: process.env.GATEWAY_ENV_PATH || '.env' }),
    JwtModule.register({}),
  ],
  controllers: [AppController],
  providers: [AppService, JwtMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).exclude('auth/(.*)').forRoutes('*');
  }
}
