import Long from 'graphql-type-long';
import { makeExecutableSchema } from 'graphql-tools';
import * as recordsQueries from './records/records.queries';
import * as recordsMutations from './records/records.mutations';
import * as reportsQueries from './reports/reports.queries';
import * as authQueries from './auth/auth.queries';
import * as authMutations from './auth/auth.mutations';
import typeDefs from './schema.graphql';

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
