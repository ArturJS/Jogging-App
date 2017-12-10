import express from 'express';
import {authUtils} from '../../utils';
import {authController} from './auth.controller';

const router = express.Router();

router.get('/user-data', authUtils.IsAuthenticated, authController.getUserData);
router.post('/sign-in', authController.doSignIn);
router.post('/sign-up', authController.doSignUp);
router.post('/sign-out', authUtils.destroySession, authController.doSignOut);

export const authApi = router;
