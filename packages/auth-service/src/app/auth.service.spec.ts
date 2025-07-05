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

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      create: jest.fn(u => u as User),
      save: jest.fn(async u => ({ id: 1, ...u } as User)),
    } as unknown as jest.Mocked<Repository<User>>;

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: repo },
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
});
