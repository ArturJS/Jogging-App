// import { Min } from 'class-validator';
import { RecordInput } from '../../graphql.schema';

export class RecordDto extends RecordInput {
  date: number;
  distance: number;
  time: number;
}
