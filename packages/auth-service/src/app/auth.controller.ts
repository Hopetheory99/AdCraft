import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  /**
   * Register a new user account.
   *
   * @param dto Registration data containing email and password
   * @returns The created user with authentication tokens
   */
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  /**
   * Authenticate a user and issue JWT tokens.
   *
   * @param dto Login credentials
   * @returns Access and refresh tokens if authentication succeeds
   */
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  /**
   * Exchange a refresh token for a new access token.
   *
   * @param token A valid refresh token
   * @returns A newly issued access token
   */
  refresh(@Body('refreshToken') token: string) {
    return this.authService.refresh(token);
  }
}
