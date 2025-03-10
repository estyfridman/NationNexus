import {PermissionEnum} from '../enums/permissionEnum';
import {RoleRequestStatusEnum} from '../enums/RoleRequestStatusEnum';

export default interface IRoleRequest {
  _id?: string;
  userId: {
    _id: string;
    username: string;
  };
  requestedPermission: PermissionEnum;
  status: RoleRequestStatusEnum;
  createdAt?: Date;
}
