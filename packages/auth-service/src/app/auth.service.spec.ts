import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let repo: jest.Mocked<Repository<User>>;
  let jwt: jest.Mocked<JwtService>;

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      create: jest.fn(u => u as User),
      save: jest.fn(async u => ({ id: 1, ...u } as User)),
    } as unknown as jest.Mocked<Repository<User>>;
    jwt = {
      sign: jest.fn(() => 'token'),
      verifyAsync: jest.fn(async () => ({ sub: 1 })),
    } as unknown as jest.Mocked<JwtService>;

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: repo },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('hashes password before saving', async () => {
    const dto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    await service.register(dto);

    const saved = repo.save.mock.calls[0][0] as User;
    expect(saved.password_hash).not.toBe(dto.password);
    expect(await bcrypt.compare(dto.password, saved.password_hash)).toBe(true);
  });

  it('logs in a user with valid credentials', async () => {
    const dto = { email: 'test@example.com', password: 'password123' };
    const user: User = {
      id: 1,
      email: dto.email,
      password_hash: await bcrypt.hash(dto.password, 10),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date(),
      refresh_token: null,
    };
    repo.findOne.mockResolvedValue(user);
    jwt.sign.mockReturnValueOnce('access').mockReturnValueOnce('refresh');

    const result = await service.login(dto);

    expect(repo.save).toHaveBeenCalled();
    expect(result.tokens.accessToken).toBe('access');
    expect(result.tokens.refreshToken).toBe('refresh');
  });

  it('refreshes tokens when refresh token valid', async () => {
    const user: User = {
      id: 1,
      email: 'test@example.com',
      password_hash: await bcrypt.hash('password123', 10),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date(),
      refresh_token: 'old',
    };
    repo.findOne.mockResolvedValue(user);
    jwt.verifyAsync.mockResolvedValue({ sub: 1 });
    jwt.sign.mockReturnValueOnce('newAccess').mockReturnValueOnce('newRefresh');

    const result = await service.refresh('old');

    expect(result.tokens.accessToken).toBe('newAccess');
    expect(result.tokens.refreshToken).toBe('newRefresh');
    expect(repo.save).toHaveBeenCalled();
  });
});
