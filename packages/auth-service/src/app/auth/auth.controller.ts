import { Controller, Post, Body, UseGuards, Request, Get, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto, LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto.email, registerDto.password);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: ExpressRequest, @Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: ExpressRequest) {
    return req.user;
  }

  @Post('refresh')
  async refreshTokens(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const user = await this.authService.getUserByRefreshToken(refreshToken);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return this.authService.refreshTokens(user);
  }
}
