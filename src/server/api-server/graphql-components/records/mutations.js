import {GraphQLNonNull, GraphQLID } from 'graphql';
import {RecordInputType, RecordType} from './schema';
import {withAuth} from '../utils';
import db from '../../models';

export const AddRecord = {
  type: RecordType,
  description: 'Add Record',
  args: {
    record: {
      name: 'Record Object',
      type: RecordInputType
    }
  },
  resolve: withAuth(async (root, args, context) => {
    const { record } = args;

    record.userId = context.userId;
    record.averageSpeed = _calcAverageSpeed(record);

    const createdRecord = await db.Record.create(record);

    return createdRecord;
  })
};

export const UpdateRecord = {
  type: RecordType,
  description: 'Update Record',
  args: {
    id: {
      name: 'Record ID',
      type: new GraphQLNonNull(GraphQLID)
    },
    impression: {
      name: 'Record Object',
      type: RecordInputType
    }
  },
  resolve: withAuth(async (root, args, context) => {
    const {record} = args;

    record.averageSpeed = _calcAverageSpeed(record);

    await db.Record.update(record, {
      where: {
        id: args.id,
        userId: context.userId
      }
    });
  })
};

export const DeleteRecord = {
  type: RecordType,
  description: 'Delete Record',
  args: {
    id: {
      name: 'Record ID',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve: withAuth(async (root, args, context) => {
    await db.Record.destroy({
      where: {
        id: args.id,
        userId: context.userId
      }
    });
  })
};

function _calcAverageSpeed(record) {
  return record.distance / record.time * 3.6;
}
