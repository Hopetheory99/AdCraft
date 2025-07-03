import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

describe('auth service', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers and logs in a user', async () => {
    const register = await request(app.getHttpServer())
      .post('/register')
      .send({ email: 'a@b.c', password: 'pass' });
    expect(register.status).toBe(201);
    const login = await request(app.getHttpServer())
      .post('/login')
      .send({ email: 'a@b.c', password: 'pass' });
    expect(login.status).toBe(201);
    expect(login.body.token).toBeDefined();
  });
});
