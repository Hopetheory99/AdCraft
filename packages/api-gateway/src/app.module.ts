import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtMiddleware } from './jwt.middleware';
import { ServiceRegistry } from './service-registry';
import { ProxyMiddleware } from './proxy.middleware';

@Module({
  providers: [ServiceRegistry, ProxyMiddleware],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes('*')
      .apply(ProxyMiddleware)
      .forRoutes('*');
  }
}
