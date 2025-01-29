import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss';
import { Request, Response, NextFunction  } from 'express';

export const sanitizeValues = (req: Request, res: Response, next: NextFunction ) => {
    const sanitizeObject = (obj: any) => {
        for (const key in obj) {
          if (typeof obj[key] === 'string') {
            obj[key] = xss(obj[key]); 
          } else if (Array.isArray(obj[key])) {
            obj[key] = obj[key].map((item) => (typeof item === 'string' ? xss(item) : item));
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeObject(obj[key]); 
          }
        }
      };
    
      if (req.body) sanitizeObject(req.body);
      if (req.query) sanitizeObject(req.query);
      if (req.params) sanitizeObject(req.params);
    
  
    next();
  };
  
  
  export const securityMiddlewares = [
    mongoSanitize(), 
    sanitizeValues,
  ];
  