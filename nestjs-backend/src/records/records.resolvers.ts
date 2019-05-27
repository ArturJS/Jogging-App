import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RecordsService } from './records.service';
import { AuthGuard } from '../common/guards';
import { Record } from '../graphql.schema';
import { RecordDto } from './dto/record.dto';

@Resolver('Records')
export class RecordsResolvers {
  constructor(private readonly recordsService: RecordsService) {}

  @Query('records')
  @UseGuards(AuthGuard)
  async getRecords(): Promise<Record[]> {
    return await this.recordsService.getRecords();
  }

  @Query('record')
  @UseGuards(AuthGuard)
  async getRecordById(@Args('id') id: number): Promise<Record> {
    return await this.recordsService.getRecordById(id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async addRecord(@Args('record') args: RecordDto): Promise<Record> {
    const createdRecord = await this.recordsService.createRecord(args);

    return createdRecord;
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async updateRecord(
    @Args('id') id: number,
    @Args('record') record: RecordDto,
  ): Promise<Record> {
    const updatedRecord = await this.recordsService.updateRecord(id, record);

    return updatedRecord;
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async deleteRecord(@Args('id') id: number): Promise<boolean> {
    const isDeleted = await this.recordsService.deleteRecord(id);

    return isDeleted;
  }
}
