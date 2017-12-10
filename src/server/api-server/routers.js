import express from 'express';

import {authUtils} from './utils/auth.utils';
import {authApi} from './components/auth';
import {recordsApi} from './components/records';
import {reportsApi} from './components/reports';


const router = express.Router();

router.use('/auth', authApi);
router.use('/records', authUtils.IsAuthenticated, recordsApi);
router.use('/reports', authUtils.IsAuthenticated, reportsApi);

export default router;