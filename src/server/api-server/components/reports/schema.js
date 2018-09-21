import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull
} from 'graphql';


export const ReportType = new GraphQLObjectType({
  name: 'report',
  fields: () => ({
    week: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    averageDistance: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    averageSpeed: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  })
});
