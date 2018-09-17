import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull
} from 'graphql';
import GraphQLLong from 'graphql-type-long';

export const RecordType = new GraphQLObjectType({
  name: 'record',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    date: {
      type: new GraphQLNonNull(GraphQLLong)
    },
    distance: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    time: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    averageSpeed: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    userId: {
      type: new GraphQLNonNull(GraphQLID)
    }
  })
});

export const RecordInputType = new GraphQLInputObjectType({
  name: 'recordInput',
  fields: () => ({
    date: {
      type: new GraphQLNonNull(GraphQLLong)
    },
    distance: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    time: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  })
});
