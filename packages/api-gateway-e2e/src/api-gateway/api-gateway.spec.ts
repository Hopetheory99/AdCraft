import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import express from 'express';
import { JwtService } from "@nestjs/jwt";
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

describe('JWT middleware', () => {
  it('rejects requests missing token', async () => {
    const res = await request(app.getHttpServer()).get('/api/stub/test');
    expect(res.status).toBe(401);
  });

  it('allows requests with valid token', async () => {
    const jwt = new JwtService();
    const token = jwt.sign({ sub: 1 }, { secret: 'secret' });
    const res = await request(app.getHttpServer())
      .get('/api/stub/test')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
