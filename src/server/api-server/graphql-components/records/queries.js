import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLList
} from 'graphql';
import _ from 'lodash';
import {RecordType} from './schema';
import db from '../../models/index';

export const Records = {
  type: new GraphQLList(RecordType),
  args: {
    userId: {
      name: 'User ID',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve: async (root, args) => {
    const recordsList = await db.Record.findAll({where: { userId: args.userId }});

    return _.sortBy(recordsList, 'date');
  }
};
