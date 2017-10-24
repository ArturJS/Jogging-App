import db from '../models';
import {jsonValidatorsUtils} from '../utils/json-validators.utils';

export const recordsController = {
  createRecord: async(req, res) => {
    const record = req.body;

    record.email = req.user.email;
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

  removeRecord: async(req, res) => {
    const {recordId} = req.params;
    const {email} = req.user;
    const relatedRecord = await db.Record.find({where: {email, id: recordId}});
    if (relatedRecord) {
      await db.Record.destroy({where: {id: recordId}});
      res.json('Ok');
    }
    res.status(404).json('NOT FOUND! There is no such record...');
  },

  getAllRecords: async(req, res) => {
    const recordsList = await db.Record.findAll({where:{email: req.user.email}});
    res.json(recordsList);
  }
};

function _calcAverageSpeed(record) {
  return record.distance / record.time * 3.6;
}