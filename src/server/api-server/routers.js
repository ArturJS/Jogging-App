import express from 'express';

import {authUtils} from './utils/auth.utils';
import {
  authController,
  recordsController,
  reportsController
} from './controllers';


const router = express.Router();

// Auth
router.get('/user-data', authUtils.IsAuthenticated, authController.getUserData);
router.post('/sign-in', authController.doSignIn);
router.post('/sign-up', authController.doSignUp);
router.post('/sign-out', authUtils.destroySession, authController.doSignOut);

// Records
router.get('/records', authUtils.IsAuthenticated, recordsController.getAllRecords);
router.post('/records', authUtils.IsAuthenticated, recordsController.createRecord);
router.put('/records/:recordId', authUtils.IsAuthenticated, recordsController.updateRecord);
router.delete('/records/:recordId', authUtils.IsAuthenticated, recordsController.removeRecord);

// Reports
router.get('/reports', authUtils.IsAuthenticated, reportsController.getAllReports);


export default router;