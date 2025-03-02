import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import {JWT_SECRET, MESSAGES} from '../constants';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({message: MESSAGES.NO_TOKEN});
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {userId: string; role: string};
    req.user = {
      _id: decoded.userId as string,
      role: decoded.role as string,
    };
    next();
  } catch (err) {
    logger.error(`${MESSAGES.ERROR_VERIFY} ${new Date()}`);
    res.status(401).json({message: MESSAGES.TOKEN_NOT_VALID});
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !roles.includes(req.user.role as string)) {
        res.status(403).json({message: MESSAGES.NOT_AUTH});
        return;
      }
      next();
    } catch (error) {
      logger.error(` ${MESSAGES.AUTH_FAIL} ${new Date()}`);
      res.status(500).json({message: MESSAGES.AUTH_FAILED, error});
    }
  };
};
