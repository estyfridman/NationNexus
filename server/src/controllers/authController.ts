import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/authService';

const JWT_SECRET = process.env.JWT_SECRET || 'hsjf38fks';

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const { token, user } = await AuthService.loginUser(username, password);

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};
