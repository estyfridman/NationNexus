import { User } from '../models/interfaces/iUser';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}