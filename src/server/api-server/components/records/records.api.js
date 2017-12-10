import express from 'express';
import {recordsController} from './records.controller';

const router = express.Router();

router.get('/', recordsController.getAllRecords);
router.post('/', recordsController.createRecord);
router.put('/:recordId', recordsController.updateRecord);
router.delete('/:recordId', recordsController.removeRecord);

export const recordsApi = router;
