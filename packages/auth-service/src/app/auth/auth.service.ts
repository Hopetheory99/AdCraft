import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'; // Import ConfigService
import { v4 as uuidv4 } from 'uuid'; // Import uuid for refresh token
import { RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService, // Inject ConfigService
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.usersRepository.create({ email: registerDto.email, password_hash: hashedPassword });
    return this.usersRepository.save(user);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(pass, user.password_hash)) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = uuidv4();
    const refreshTokenExpiresIn = this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION_DAYS') || 7;
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + refreshTokenExpiresIn);

    await this.usersRepository.update(user.id, { refreshToken, refreshTokenExpiresAt });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshTokens(user: User) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = uuidv4();
    const refreshTokenExpiresIn = this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION_DAYS') || 7;
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + refreshTokenExpiresIn);

    await this.usersRepository.update(user.id, { refreshToken, refreshTokenExpiresAt });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async getUserByRefreshToken(refreshToken: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { refreshToken } });
    if (user && user.refreshTokenExpiresAt && user.refreshTokenExpiresAt > new Date()) {
      return user;
    }
    return undefined;
  }
}
