import {User} from '../models/interfaces/iUser';
import {PermissionEnum} from '../models/enums/permissionEnum';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        permissions?: PermissionEnum[];
      };
    }
  }
}
