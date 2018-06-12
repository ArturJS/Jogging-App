import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { Records } from './records/queries';
import { AddRecord, UpdateRecord, DeleteRecord } from './records/mutations';
import { Reports } from './reports/queries';

const RootType = new GraphQLObjectType({
  name: 'RootType',
  fields: {
    records: Records,
    recordAdd: AddRecord,
    recordUpdate: UpdateRecord,
    recordDelete: DeleteRecord,
    reports: Reports
  }
});

export default new GraphQLSchema({
  query: RootType
});
