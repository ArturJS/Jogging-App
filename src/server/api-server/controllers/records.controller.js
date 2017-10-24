import db from '../models';
import {jsonValidatorsUtils} from '../utils/json-validators.utils';

export const recordsController = {
  createRecord: async(req, res) => {
    const record = req.body;

    record.email = req.user.email;
    console.log('record.email', record.email);
    record.averageSpeed = _calcAverageSpeed(record);

    const createdRecord = await db.Record.create(record);
    res.json(createdRecord);
  },

  updateRecord: async(req, res) => {
    const {recordId} = req.params;
    const record = req.body;
    record.averageSpeed = _calcAverageSpeed(record);
    const updatedRecord = await db.Record.update({
      id: recordId,
      ...record
    });
    res.json(updatedRecord);
  },

  getAllRecords: async(req, res) => {
    const recordsList = await db.Record.findAll({where:{email: req.user.email}});
    res.json(recordsList);
  }
};

function _calcAverageSpeed(record) {
  return record.distance / record.time * 3.6;
}