import {RoleEnum} from '../enums/RoleEnum';

export default interface IRoleRequest {
  _id?: string;
  userId: {
    _id: string;
    username: string;
  };
  requestedRole: RoleEnum;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: Date;
}
