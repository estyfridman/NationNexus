import {PermissionEnum} from '../enums/permissionEnum';
import {RoleRequestStatusEnum} from '../enums/RoleRequestStatusEnum';

export interface IPermissionRequest {
  _id?: string;
  userId: {
    _id: string;
    username: string;
  };
  requested: PermissionEnum;
  status: RoleRequestStatusEnum;
  createdAt: Date;
}
