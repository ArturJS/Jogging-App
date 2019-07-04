import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
// import { AuthGuard } from '@nestjs/passport';
import { AuthGuard } from '../common/guards';
import { ReportsService } from './reports.service';
import { Report } from '../graphql.schema';

@Resolver('Reports')
export class ReportsResolvers {
  constructor(private readonly reportsService: ReportsService) {}

  @Query('reports')
  // @UseGuards(AuthGuard())
  async getReports(): Promise<Report[]> {
    return await this.reportsService.getReports();
  }
}
