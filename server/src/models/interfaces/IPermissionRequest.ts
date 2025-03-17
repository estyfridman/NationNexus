import {PermissionEnum} from '../enums/permissionEnum';
import {RoleRequestStatusEnum} from '../enums/RoleRequestStatusEnum';

export interface IPermissionRequest {
  id?: string;
  userId: string;
  requested: PermissionEnum;
  status: RoleRequestStatusEnum;
  createdAt: Date;
}
