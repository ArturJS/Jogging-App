import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app
    .use(
      session({
        secret: 'a secret',
        name: 'session-cookie',
        resave: true,
        saveUninitialized: true,
      }),
    )
    .use(passport.initialize())
    .use(passport.session());

  await app.listen(3000);
}
bootstrap();
