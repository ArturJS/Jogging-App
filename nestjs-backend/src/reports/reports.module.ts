import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { RecordsModule } from '../records/records.module';
import { ReportsService } from './reports.service';
import { ReportsResolvers } from './reports.resolvers';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'local' }),
    RecordsModule,
  ],
  providers: [ReportsService, ReportsResolvers],
})
export class ReportsModule {}
