import { Module } from '@nestjs/common';
import { RecordsModule } from '../records/records.module';
import { ReportsService } from './reports.service';
import { ReportsResolvers } from './reports.resolvers';

@Module({
  imports: [RecordsModule],
  providers: [ReportsService, ReportsResolvers],
})
export class ReportsModule {}
