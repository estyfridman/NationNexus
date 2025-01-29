import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


const requireRole = (role: 'admin' | 'user') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user?.role !== role) {
      return res.status(403).json({ message: 'no permisions' });
    }
    next();
  };
};

// to route or utils ?
// app.post('/admin', requireRole('admin'), (req: Request, res: Response) => {
//   res.status(200).json({ message: 'Welcome Admin' });
// });

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).send('Access denied');
    }
  
    try {
      const decoded = jwt.verify(token, 'your-secret-key');
      req.user = decoded;  // כאן אתה מגדיר את 'user' ב-req
      next();
    } catch (error) {
      res.status(400).send('Invalid token');
    }
  };