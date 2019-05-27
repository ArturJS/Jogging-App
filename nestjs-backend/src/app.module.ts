import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { RecordsModule } from './records/records.module';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
    }),
    RecordsModule,
    ReportsModule,
    AuthModule,
  ],
})
export class AppModule {}