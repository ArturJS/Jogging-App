import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<boolean> {
    return email === 'test@user.com' && password === '123';
  }

  async signUp({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<boolean> {
    return true;
  }

  async validateUser() {}
}
