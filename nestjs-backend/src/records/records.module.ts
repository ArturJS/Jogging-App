import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsResolvers } from './records.resolvers';

@Module({
  providers: [RecordsService, RecordsResolvers],
})
export class RecordsModule {}
