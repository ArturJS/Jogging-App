import express from 'express';
import {reportsController} from './reports.controller';

const router = express.Router();

router.get('/', reportsController.getAllReports);

export const reportsApi = router;
