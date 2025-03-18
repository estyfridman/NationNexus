import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import {JWT_SECRET, MESSAGES} from '../constants';
import {PermissionEnum} from '../models/enums/permissionEnum';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({message: MESSAGES.NO_TOKEN});
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {userId: string; permissions: PermissionEnum[]};
    req.user = {
      _id: decoded.userId as string,
      permissions: Array.isArray(decoded.permissions) ? decoded.permissions : [],
    };
    next();
  } catch (err) {
    logger.error(`${MESSAGES.ERROR_VERIFY} ${new Date()}`);
    res.status(401).json({message: MESSAGES.TOKEN_NOT_VALID});
  }
};

export const authorize = (requiredPermissions: PermissionEnum[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log();
    try {
      const userPermissions: PermissionEnum[] = req.user?.permissions || [];

      if (!req.user) {
        res.status(403).json({message: MESSAGES.NOT_AUTH});
        return;
      }

      const hasPermission = requiredPermissions.some((permission) => userPermissions.includes(permission));

      if (!hasPermission) {
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
