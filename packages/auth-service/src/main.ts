import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function createApp() {
  const app = await NestFactory.create(AppModule);
  return app;
}

async function bootstrap() {
  const app = await createApp();
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Auth service running on ${port}`);
}

if (require.main === module) {
  bootstrap();
}
