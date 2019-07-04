import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(...args) {
    console.log('Validate user: ', args);
    // const user = await this.authService.validateUser(token);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // return user;
  }
}
