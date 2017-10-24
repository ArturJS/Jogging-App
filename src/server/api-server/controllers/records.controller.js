import db from '../models';
import {jsonValidatorsUtils} from '../utils/json-validators.utils';

export const recordsController = {
  createRecord: async(req, res) => {
    const {email} = req.user;
    const record = req.body;

    // todo add validators processing at first (in each controller)
    const recordWithSameDate = await db.Record.find({where: {email, date: record.date}});
    if (recordWithSameDate) {
      res.status(400).json({error: 'Record with the same date already exists!'});
      return;
    }

    record.email = req.user.email;
    record.averageSpeed = _calcAverageSpeed(record);

    const createdRecord = await db.Record.create(record);
    res.json(createdRecord);
  },

  updateRecord: async(req, res) => {
    const {email} = req.user;
    const {recordId} = req.params;
    const record = req.body;

    // todo add validators processing at first (in each controller)
    const recordWithSameDate = await db.Record.find({where: {email, date: record.date}});
    if (recordWithSameDate && recordWithSameDate.id !== recordId) {
      res.status(400).json({error: 'Record with the same date already exists!'});
      return;
    }

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
    res.status(404).json({error: 'NOT FOUND! There is no such record...'});
  },

  getAllRecords: async(req, res) => {
    const recordsList = await db.Record.findAll({where:{email: req.user.email}});
    res.json(recordsList);
  }
};

// private methods

function _calcAverageSpeed(record) {
  return record.distance / record.time * 3.6;
}