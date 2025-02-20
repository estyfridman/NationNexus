import { RoleEnum } from '../../../../shared/enums';

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
