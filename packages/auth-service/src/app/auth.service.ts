import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { UserResponseDto } from './dto/user-response.dto';

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

  async register(dto: RegisterDto): Promise<UserResponseDto> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const user = this.userRepo.create({
      email: dto.email,
      password_hash: await bcrypt.hash(dto.password, 10),
    });

    const saved = await this.userRepo.save(user);
    return this.toResponseDto(saved);
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

    return { user: this.toResponseDto(user), tokens };
  }

  async refresh(token: string) {
    let payload: { sub: number };
    try {
      const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_REFRESH_SECRET is not configured');
      }
      payload = await this.jwtService.verifyAsync(token, {
        secret,
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

    return { user: this.toResponseDto(user), tokens };
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessSecret = process.env.JWT_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET || accessSecret;

    if (!accessSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    if (!refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET is not configured');
    }

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: accessSecret,
        expiresIn: process.env.JWT_EXPIRATION || '15m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: refreshSecret,
        expiresIn:
          process.env.JWT_REFRESH_EXPIRATION || process.env.REFRESH_TOKEN_EXPIRATION || '7d',
      }),
    };
  }

  private toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
