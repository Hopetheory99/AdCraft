import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe, BadRequestException } from '@nestjs/common';
import * as request from 'supertest';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

describe('AuthController', () => {
  let app: INestApplication;
  const service = { register: jest.fn() };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: service }],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await app.close();
  });

  it('should register user successfully', async () => {
    const dto: RegisterDto = { email: 'test@example.com', password: 'password123' };
    service.register.mockResolvedValue({ id: 1, email: dto.email });

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(dto)
      .expect(201)
      .expect({ id: 1, email: dto.email });

    expect(service.register).toHaveBeenCalledWith(dto);
  });

  it('should return 400 when service throws', async () => {
    const dto: RegisterDto = { email: 'test@example.com', password: 'password123' };
    service.register.mockRejectedValue(new BadRequestException('Email already registered'));

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(dto)
      .expect(400);

    expect(service.register).toHaveBeenCalledWith(dto);
  });
});
