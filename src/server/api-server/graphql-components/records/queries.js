import { GraphQLList, GraphQLInputObjectType } from 'graphql';
import GraphQLLong from 'graphql-type-long';
import _ from 'lodash';
import { RecordType } from './schema';
import { withAuth } from '../utils';
import db from '../../models/index';

const MAX_DATE = Number.MAX_SAFE_INTEGER;
const MIN_DATE = -MAX_DATE;

export const Records = {
  type: new GraphQLList(RecordType),
  args: {
    filter: {
      name: 'Filter Object',
      type: new GraphQLInputObjectType({
        name: 'filterInput',
        fields: () => ({
          startDate: {
            type: GraphQLLong
          },
          endDate: {
            type: GraphQLLong
          }
        })
      })
    }
  },
  resolve: withAuth(async (root, args, context) => {
    const { filter: { startDate, endDate } = {} } = args;

    const recordsList = await db.Record.findAll({
      where: {
        userId: context.userId,
        date: {
          $between: [startDate || MIN_DATE, endDate || MAX_DATE]
        }
      }
    });

    return _.sortBy(recordsList, 'date');
  })
};
