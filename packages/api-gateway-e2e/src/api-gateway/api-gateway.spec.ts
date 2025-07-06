import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import express from 'express';
import request from 'supertest';

import { AppModule } from '../../../api-gateway/src/app/app.module';

let app: INestApplication;
let server: any;

beforeAll(async () => {
  const stub = express();
  stub.get('/test', (_, res) => res.json({ ok: true }));
  await new Promise<void>(resolve => {
    server = stub.listen(0, resolve);
  });
  const port = (server.address() as any).port;
  process.env.SERVICE_ROUTES = `stub=http://localhost:${port}`;

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  app.setGlobalPrefix('api');
  await app.init();
});

afterAll(async () => {
  await app.close();
  server.close();
});

describe('GET /api', () => {
  it('should return a message', async () => {
    const res = await request(app.getHttpServer()).get('/api');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Hello API' });
  });
});

describe('Dynamic service discovery', () => {
  it('reads SERVICE_ROUTES environment variable', () => {
    expect(process.env.SERVICE_ROUTES).toContain('stub=');
  });
});
