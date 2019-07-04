// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
// import { GqlExecutionContext } from '@nestjs/graphql';

// @Injectable()
// export class AuthGuard extends PassportAuthGuard('local') {
//   getRequest(context: ExecutionContext) {
//     const ctx = GqlExecutionContext.create(context);

//     console.log('AuthGuard getRequest() ctx: ', ctx);

//     return ctx.getContext().req;
//   }

//   canActivate(context: ExecutionContext) {
//     const ctx = GqlExecutionContext.create(context);

//     // console.log('AuthGuard canActivate() ctx: ', ctx);

//     return super.canActivate(context);
//   }
// }

import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends PassportAuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const result = (await super.canActivate(context)) as boolean;

    await super.logIn(request);

    return result;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
