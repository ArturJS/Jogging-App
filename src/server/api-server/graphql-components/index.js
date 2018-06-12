import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { Records } from './records/queries';
import { AddRecord, UpdateRecord, DeleteRecord } from './records/mutations';
import { Reports } from './reports/queries';
import { SignIn, GetUserData, SignOut } from './auth/queries';
import { SignUp } from './auth/mutations';

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    records: Records,
    reports: Reports,
    getUserData: GetUserData
  }
});
const Mutations = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    recordAdd: AddRecord,
    recordUpdate: UpdateRecord,
    recordDelete: DeleteRecord,
    signIn: SignIn,
    signOut: SignOut,
    signUp: SignUp
  }
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutations
});
