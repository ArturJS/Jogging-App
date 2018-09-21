import {
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLID
} from 'graphql';
import GraphQLLong from 'graphql-type-long';
import _ from 'lodash';
import { RecordType } from './schema';
import { withAuth } from '../utils';
import db from '../../models/index';

const MAX_DATE = Number.MAX_SAFE_INTEGER;
const MIN_DATE = -MAX_DATE;

export const records = {
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

export const record = {
  type: RecordType,
  args: {
    id: {
      name: 'Record Id',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve: withAuth(async (root, args, context) => {
    const { id } = args;
    const { userId } = context;
    const record = await db.Record.findOne({
      where: {
        userId,
        id
      }
    });

    return record;
  })
};
