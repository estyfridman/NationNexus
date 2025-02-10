export interface IPermissionRequest {
  id?: string;
  userId: string;
  currentRole: string;
  requestedRole: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  userEmail: string;
  userName: string;
}
