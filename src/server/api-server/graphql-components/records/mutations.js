import {GraphQLNonNull, GraphQLID, GraphQLError } from 'graphql'
import {RecordInputType, RecordType} from './schema';
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
  resolve: async (root, args) => {
    const { record } = args;

    record.userId = 3; // todo pass the userId
    record.averageSpeed = _calcAverageSpeed(record);

    const createdRecord = await db.Record.create(record);

    return createdRecord;
  }
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
  resolve: async (root, args) => {
    const {record} = args;

    record.averageSpeed = _calcAverageSpeed(record);

    await db.Record.update(record, {
      where: {
        id: args.id
      }
    });
  }
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
  resolve: async (root, args) => {
    await db.Record.destroy({where: {id: args.id}});
  }
};

function _calcAverageSpeed(record) {
  return record.distance / record.time * 3.6;
}
