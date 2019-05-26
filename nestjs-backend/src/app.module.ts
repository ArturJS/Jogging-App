import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { RecordsModule } from './records/records.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
    }),
    RecordsModule,
  ],
})
export class AppModule {}
