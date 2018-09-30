import authSchema from './auth/schema';
import recordsSchema from './records/schema';
import reportsSchema from './reports/schema';

const initialQueryAndMutation = `
    type Query

    type Mutation
`;
const customTypeDefs = `
    scalar Long
`;

export default [
  initialQueryAndMutation,
  customTypeDefs,
  authSchema,
  recordsSchema,
  reportsSchema
].join('\n');
