import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString
} from 'graphql';

export const SignInType = new GraphQLInputObjectType({
  name: 'signIn',
  fields: () => ({
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  })
});

export const SignUpType = new GraphQLInputObjectType({
  name: 'signUp',
  fields: () => ({
    firstName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    },
    repeatPassword: {
      type: new GraphQLNonNull(GraphQLString)
    }
  })
});

export const UserType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    firstName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    }
  })
});
