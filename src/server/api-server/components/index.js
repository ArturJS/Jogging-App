import Long from 'graphql-type-long';
import { makeExecutableSchema } from 'graphql-tools';
import * as recordsQueries from './records/queries';
import * as recordsMutations from './records/mutations';
import * as reportsQueries from './reports/queries';
import * as authQueries from './auth/queries';
import * as authMutations from './auth/mutations';
import typeDefs from './schema';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: {
      ...recordsQueries,
      ...reportsQueries,
      ...authQueries
    },
    Mutation: {
      ...recordsMutations,
      ...authMutations
    },
    Long
  }
});

export default schema;
