import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AppModule } from './app.module';
import { ServiceRegistry } from './service-registry';

export async function createApp() {
  const app = await NestFactory.create(AppModule);
  await app.init();
  const registry = app.get(ServiceRegistry);
  console.log('service map', process.env.SERVICE_MAP);
  const expressApp = app.getHttpAdapter().getInstance();
  // proxy middleware is applied via AppModule

  return app;
}

async function bootstrap() {
  const app = await createApp();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`API Gateway running on ${port}`);
}

if (require.main === module) {
  bootstrap();
}
