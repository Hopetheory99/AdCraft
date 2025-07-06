import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<Omit<User, 'password_hash'>> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const user = this.userRepo.create({
      email: dto.email,
      password_hash: await bcrypt.hash(dto.password, 10),
    });

    const saved = await this.userRepo.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...result } = saved;
    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(user);
    user.refresh_token = tokens.refreshToken;
    await this.userRepo.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, refresh_token, ...usr } = user;
    return { user: usr, tokens };
  }

  async refresh(token: string) {
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'secret',
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user || user.refresh_token !== token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = this.generateTokens(user);
    user.refresh_token = tokens.refreshToken;
    await this.userRepo.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, refresh_token, ...usr } = user;
    return { user: usr, tokens };
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'secret',
        expiresIn: process.env.JWT_EXPIRATION || '15m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'secret',
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || process.env.REFRESH_TOKEN_EXPIRATION || '7d',
      }),
    };
  }
}
