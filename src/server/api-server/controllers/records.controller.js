import _ from 'lodash';

import db from '../models';
import {validationUtils} from '../utils/validation.utils';
import {recordsSchema} from './schemas/records.schema';

export const recordsController = {
  createRecord: async(req, res) => {
    const valid = await validationUtils.ensureValidation(req, res, [
      _recordsJsonValidator,
      _dateUniquenessValidator
    ]);
    if (!valid) return;

    const record = req.body;

    record.userId = req.user.id;
    record.averageSpeed = _calcAverageSpeed(record);

    const createdRecord = await db.Record.create(record);
    res.json(createdRecord);
  },

  updateRecord: async(req, res) => {
    const valid = await validationUtils.ensureValidation(req, res, [
      _recordsJsonValidator,
      _hasAccessToRecordValidator,
      _dateUniquenessValidator
    ]);
    if (!valid) return;

    const {recordId} = req.params;
    const record = req.body;

    record.averageSpeed = _calcAverageSpeed(record);
    await db.Record.update(record, {
      where: {
        id: recordId
      }
    });
    const updatedRecord = await db.Record.findById(recordId);
    res.json(updatedRecord);
  },

  removeRecord: async(req, res) => {
    const valid = await validationUtils.ensureValidation(req, res, [
      _hasAccessToRecordValidator
    ]);
    if (!valid) return;

    const {recordId} = req.params;
    await db.Record.destroy({where: {id: recordId}});
    res.json('Ok');
  },

  getAllRecords: async(req, res) => {
    const recordsList = await db.Record.findAll({where: {userId: req.user.id}});
    res.json(_.sortBy(recordsList, 'date'));
  }
};

// private methods

function _calcAverageSpeed(record) {
  return record.distance / record.time * 3.6;
}

// validators

async function _recordsJsonValidator(req) {
  const recordsValidator = validationUtils.getValidatorBySchema(recordsSchema);
  const valid = recordsValidator(req.body);

  if (!valid) {
    return recordsValidator.errors;
  }
}

async function _dateUniquenessValidator(req) {
  const {id} = req.user;
  const {recordId} = req.params;
  const record = req.body;
  const recordWithSameDate = await db.Record.find({where: {userId: id, date: record.date}});

  if (recordWithSameDate && recordWithSameDate.id !== +recordId) {
    return 'Record with the same date already exists!';
  }
}

async function _hasAccessToRecordValidator(req) {
  const {id} = req.user;
  const {recordId} = req.params;
  const relatedRecord = await db.Record.find({where: {userId: id, id: recordId}});

  if (!relatedRecord) return 'NOT FOUND! There is no such record...';
}