import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email);
  }

  async create(email: string, password: string): Promise<User> {
    const user: User = { id: this.users.length + 1, email, password };
    this.users.push(user);
    return user;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.users.map(({ password, ...rest }) => rest);
  }
}
