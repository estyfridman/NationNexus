import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'hsjf38fks';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    req.user = {
      _id: decoded.userId as string,
      role: decoded.role as string,
    };
    next();
  } catch (err) {
    logger.error(`Error verifying in ${new Date()}`);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !roles.includes(req.user.role as string)) {
        res.status(403).json({ message: 'Not authorized' });
        return;
      }
      next();
    } catch (error) {
      logger.error(`Authorization failed in ${new Date()}`);
      res.status(500).json({ message: 'Authorization failed', error });
    }
  };
};
