import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import * as recordsQueries from './records/queries';
import * as recordsMutations from './records/mutations';
import * as reportsQueries from './reports/queries';
import * as authQueries from './auth/queries';
import * as authMutations from './auth/mutations';

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...recordsQueries,
    ...reportsQueries,
    ...authQueries
  }
});
const Mutations = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...recordsMutations,
    ...authMutations
  }
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutations
});
