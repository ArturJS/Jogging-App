import Long from 'graphql-type-long';
import { makeExecutableSchema } from 'graphql-tools';
import config from '../config';
import * as recordsQueries from './records/records.queries';
import * as recordsMutations from './records/records.mutations';
import * as reportsQueries from './reports/reports.queries';
import * as authQueries from './auth/auth.queries';
import * as authMutations from './auth/auth.mutations';
import * as e2eTestsMutations from './e2e-tests/e2e-tests.mutations';
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
            ...authMutations,
            ...(config.isE2E ? e2eTestsMutations : {})
        },
        Long
    }
});

export default schema;
