import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { Records } from './records/queries';
import { AddRecord, UpdateRecord, DeleteRecord } from './records/mutations';

const RootType = new GraphQLObjectType({
  name: 'RootType',
  fields: {
    records: Records,
    recordAdd: AddRecord,
    recordUpdate: UpdateRecord,
    recordDelete: DeleteRecord
  }
});

export default new GraphQLSchema({
  query: RootType
});
