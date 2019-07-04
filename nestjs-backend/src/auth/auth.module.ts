import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthResolvers } from './auth.resolvers';
import { LocalStrategy } from './local.strategy';
import { AuthCookieSerializer } from './auth-cookie.serializer';

@Module({
  // imports: [
  //   PassportModule.register({ defaultStrategy: 'local', session: true }),
  // ],
  // exports: [PassportModule],
  // providers: [AuthService, AuthResolvers, LocalStrategy],

  imports: [
    PassportModule.register({ defaultStrategy: 'local', session: true }),
  ],
  providers: [AuthService, LocalStrategy, AuthCookieSerializer, AuthResolvers],
  exports: [PassportModule],
})
export class AuthModule {}
