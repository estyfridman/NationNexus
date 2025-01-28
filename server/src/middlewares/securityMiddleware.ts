import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss';
import { Request, Response, NextFunction  } from 'express';

export const sanitizeInputs = (req: Request, res: Response, next: NextFunction ) => {
    if (req.body) {
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
            req.body[key] = xss(req.body[key]);
        }
      }
    }
    if (req.query) {
      for (const key in req.query) {
        const value = req.query[key];
        if (typeof value === 'string') {
          req.query[key] = xss(value);
        } else if (Array.isArray(value)) {
          req.query[key] = value.map((item) =>
            typeof item === 'string' ? xss(item) : item
          );
        }
      }
    }
  
    next();
  };
  
  
  export const securityMiddlewares = [
    mongoSanitize(), 
  ];
  