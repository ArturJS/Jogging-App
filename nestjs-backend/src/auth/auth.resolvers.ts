import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver('Auth')
export class AuthResolvers {
  constructor(private readonly authService: AuthService) {}

  @Mutation()
  async signIn(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<boolean> {
    const isSuccess = await this.authService.signIn({
      email,
      password,
    });

    return isSuccess;
  }

  @Mutation()
  async signUp(
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<boolean> {
    const isSuccess = await this.authService.signUp({
      firstName,
      lastName,
      email,
      password,
    });

    return isSuccess;
  }

  @Mutation()
  async signOut(): Promise<boolean> {
    return true;
  }
}
