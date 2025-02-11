import { Request, Response } from 'express';
import AuthService from '../services/authService';
import User from '../models/mongooseSchemas/userSchema';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { ResetToken } from '../models/mongooseSchemas/resetTokenSchema';
import { mailService } from '../services/mailService';
import logger from '../utils/logger';

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const { token, user } = await AuthService.loginUser(username, password);

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User Not Found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await ResetToken.create({
      userId: user!._id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    await mailService.sendPasswordResetEmail(email, resetToken);

    res.status(200).json({
      message: 'A password reset link was sent to the email',
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Error in the password reset process' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const resetTokenDoc = await ResetToken.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() },
    });

    if (!resetTokenDoc) {
      res.status(400).json({
        message: 'Invalid or expired token',
      });
      return;
    }

    const user = await User.findById(resetTokenDoc.userId);
    if (!user || user === null) {
      res.status(404).json({ message: 'User Not Found' });
    }

    const salt = await bcrypt.genSalt(10);
    user!.password = await bcrypt.hash(newPassword, salt);
    await user!.save();

    await ResetToken.deleteOne({ _id: resetTokenDoc._id });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Password reset error' });
  }
};
