import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

@Controller()
export class AuthController {
  constructor(private auth: AuthService, private users: UsersService) {}

  @Post('register')
  async register(@Body('email') email: string, @Body('password') password: string) {
    const user = await this.auth.register(email, password);
    const login = await this.auth.login(email, password);
    return { user, token: login.token };
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    return this.auth.login(email, password);
  }

  @Get('users')
  async usersList() {
    return this.users.findAll();
  }
}
