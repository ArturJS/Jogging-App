import express from 'express';

import {authUtils} from './utils/auth.utils';
import {authController} from './controllers';


const router = express.Router();

router.get('/user-data', authUtils.IsAuthenticated, authController.getUserData);
router.post('/sign-in', authController.doSignIn);
router.post('/sign-up', authController.doSignUp);
router.post('/sign-out', authUtils.destroySession, authController.doSignOut);

export default router;