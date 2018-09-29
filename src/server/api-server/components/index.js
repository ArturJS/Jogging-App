import path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { importSchema } from 'graphql-import';
import * as recordsQueries from './records/queries';
import * as recordsMutations from './records/mutations';
import * as reportsQueries from './reports/queries';
import * as authQueries from './auth/queries';
import * as authMutations from './auth/mutations';

console.log(__dirname);

const schema = makeExecutableSchema({
  typeDefs: importSchema(path.resolve(__dirname, 'schema.graphql')),
  resolvers: {
    Query: {
      ...recordsQueries,
      ...reportsQueries,
      ...authQueries
    },
    Mutation: {
      ...recordsMutations,
      ...authMutations
    }
  }
});

export default schema;
