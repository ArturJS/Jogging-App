import { GraphQLList } from 'graphql';
import _ from 'lodash';
import {RecordType} from './schema';
import {withAuth} from '../utils';
import db from '../../models/index';

export const Records = {
  type: new GraphQLList(RecordType),
  resolve: withAuth(async (root, args, context) => {
    const recordsList = await db.Record.findAll({
      where: {
        userId: context.userId
      }
    });

    return _.sortBy(recordsList, 'date');
  })
};
