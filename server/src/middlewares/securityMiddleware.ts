import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss';
import {Request, Response, NextFunction} from 'express';
import {TEXT} from '../constants';

export const xssValues = (req: Request, res: Response, next: NextFunction) => {
  const xssObject = (obj: any) => {
    for (const key in obj) {
      if (typeof obj[key] === TEXT.STRING) {
        obj[key] = xss(obj[key]);
      } else if (Array.isArray(obj[key])) {
        obj[key] = obj[key].map((item) => (typeof item === TEXT.STRING ? xss(item) : item));
      } else if (typeof obj[key] === TEXT.OBJECT && obj[key] !== null) {
        xssObject(obj[key]);
      }
    }
  };

  if (req.body) xssObject(req.body);
  if (req.query) xssObject(req.query);
  if (req.params) xssObject(req.params);

  next();
};

export const securityMiddlewares = [mongoSanitize(), xssValues];
