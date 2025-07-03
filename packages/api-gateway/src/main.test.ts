import request from 'supertest';
import express from 'express';
import * as jwt from 'jsonwebtoken';
import { INestApplication } from '@nestjs/common';
import { createApp } from './main';

const JWT_SECRET = 'testsecret';

describe('api gateway', () => {
  let app: INestApplication;
  let server: any;
  beforeAll(async () => {
    process.env.JWT_SECRET = JWT_SECRET;
    const service = express();
    service.get('/hello', (_req, res) => res.json({ ok: true }));
    server = service.listen(0);
    const port = server.address().port;
    console.log('test service port', port);
    process.env.SERVICE_MAP = JSON.stringify({ test: `http://localhost:${port}` });

    app = await createApp();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    server.close();
  });

  it('rejects request without token', async () => {
    const res = await request(app.getHttpServer()).get('/test/hello');
    expect(res.status).toBe(401);
  });

  it('proxies request with valid token', async () => {
    const token = jwt.sign({ sub: 1 }, JWT_SECRET);
    const res = await request(app.getHttpServer())
      .get('/test/hello')
      .set('Authorization', `Bearer ${token}`);
    console.log('res', res.status, res.text);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
