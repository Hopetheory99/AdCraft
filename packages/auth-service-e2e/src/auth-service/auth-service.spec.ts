import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import request from 'supertest';

import { AuthController } from '../../../auth-service/src/app/auth.controller';
import { AuthService } from '../../../auth-service/src/app/auth.service';
import { AppController } from '../../../auth-service/src/app/app.controller';
import { AppService } from '../../../auth-service/src/app/app.service';
import { User } from '../../../auth-service/src/app/user.entity';

describe('AuthService integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'testsecret';
    process.env.JWT_REFRESH_SECRET = 'refreshsecret';

    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [User],
          synchronize: true,
        }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [AppController, AuthController],
      providers: [AppService, AuthService],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers a new user', async () => {
    const dto = { email: 'test@example.com', password: 'password123' };

    const res = await request(app.getHttpServer()).post('/auth/register').send(dto).expect(201);

    expect(res.body).toEqual(expect.objectContaining({ id: 1, email: dto.email }));
    expect(res.body).not.toHaveProperty('password_hash');
  });

  it('logs in a registered user', async () => {
    const credentials = { email: 'login@example.com', password: 'password123' };

    await request(app.getHttpServer()).post('/auth/register').send(credentials);

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(credentials)
      .expect(201);

    expect(res.body.tokens.accessToken).toBeDefined();
    expect(res.body.tokens.refreshToken).toBeDefined();
  });

  it('refreshes tokens with valid refresh token', async () => {
    const credentials = {
      email: 'refresh@example.com',
      password: 'password123',
    };

    await request(app.getHttpServer()).post('/auth/register').send(credentials);
    const loginRes = await request(app.getHttpServer()).post('/auth/login').send(credentials);

    const refreshToken = loginRes.body.tokens.refreshToken;

    const res = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken })
      .expect(201);

    expect(res.body.tokens.accessToken).toBeDefined();
    expect(res.body.tokens.refreshToken).toBeDefined();
  });
});
