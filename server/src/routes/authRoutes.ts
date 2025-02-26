import express from 'express';
import {loginUser, forgotPassword, resetPassword} from '../controllers/authController';

const router = express.Router();

router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
