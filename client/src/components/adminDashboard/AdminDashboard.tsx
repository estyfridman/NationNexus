import { useEffect, useState } from 'react';
import {
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import IUser from '../../models/interfaces/iUser';
import Loading from '../loading/Loading';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDeleteUser, useGetUsers, useGrantPermission } from '../../services/hooks/userHooks';
import { deleteAlert, errorDeleteAlert, successAlert, errorAlert } from '../../utils/sweet-alerts';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../../services/recoilService/userState';
import { initialUser } from '../../utils/initialValues';
import { useNavigate } from 'react-router-dom';
import { RoleEnum } from '../../../../shared/enums';
import './adminDashboard.scss';
import { generateCurrentPath } from '../../utils/generateCurrentPath';
import { selectedUserState } from '../../services/recoilService/selectedUserState';

export default function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(initialUser);
  const [newRole, setNewRole] = useState<RoleEnum | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const setSelectedUserState = useSetRecoilState(selectedUserState);

  const { data: users, isLoading, isError } = useGetUsers();
  const { mutate: grantPermission } = useGrantPermission();
  const deleteUserMutation = useDeleteUser();
  const { user } = useRecoilValue(userState);

  const navigate = useNavigate();

  const handleRoleChange = (userId: string, newRole: RoleEnum | null) => {
    if (!userId || !newRole || userId === '') {
      errorAlert('Please select a user and role before clicking update.');
      return;
    }
    grantPermission({ userId, role: newRole });
    setNewRole(null);
    setIsEditing(false);
  };

  const handleDelete = (event: React.MouseEvent, userId: string) => {
    event.stopPropagation();
    deleteAlert(() => {
      deleteUserMutation.mutate(userId, {
        onSuccess: () => {
          successAlert();
        },
        onError: () => {
          errorDeleteAlert('Failed to delete the record. Please try again.');
        },
      });
    });
  };

  const handleEditClick = (user: IUser) => {
    setSelectedUserState(user);
    setNewRole(user.role);
    setIsEditing(true);
    navigate(`/editUser/${user._id}`);
  };

  const columns = [
    { field: 'firstName', headerName: 'First Name', flex: 1, headerClassName: 'custom-header' },
    { field: 'lastName', headerName: 'Last Name', flex: 1, headerClassName: 'custom-header' },
    { field: 'email', headerName: 'Email', flex: 1, headerClassName: 'custom-header' },
    { field: 'phone', headerName: 'Phone', flex: 1, headerClassName: 'custom-header' },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      headerClassName: 'custom-header',
      sortable: false,
      renderCell: (params: any) => (
        <>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(params.row);
            }}
            style={{ marginRight: '8px' }}
          >
            <EditIcon />
          </IconButton>
          <IconButton onClick={(e) => handleDelete(e, params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (!user || user.role !== RoleEnum.ADMIN) {
      navigate('/');
    }
  }, [user, navigate]);

  if (isLoading) return <Loading />;
  if (isError) return;

  return (
    <div>
      <Typography className="admin-dashboard-title">Admin Dashboard</Typography>
      <div>
        {users && (
          <DataGrid
            rows={users?.map((user) => ({ ...user, id: user._id })) || []}
            columns={columns}
            editMode="row"
            onRowClick={(params) => setSelectedUser(params.row)}
          />
        )}
      </div>
      {selectedUser && selectedUser.firstName && (
        <div className="container">
          <Card className="user-details-card">
            <CardMedia
              component="img"
              height="100"
              image={generateCurrentPath(selectedUser.profileImage) || 'placeholder_image_url'}
              alt={`${selectedUser.firstName} ${selectedUser.lastName} Profile`}
            />
            <CardContent>
              <Typography variant="h6" component="div">
                {selectedUser.firstName} {selectedUser.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                User Name: {selectedUser.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {selectedUser.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone: {selectedUser.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Role: {selectedUser.role}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created At: {new Date(selectedUser.createdAt).toLocaleDateString()}{' '}
              </Typography>
            </CardContent>
          </Card>
          <div className="role-change-section">
            <Typography variant="h6">
              Change Role for {selectedUser.firstName} {selectedUser.lastName}
            </Typography>
            <FormControl>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={newRole || selectedUser.role}
                label="Role"
                onChange={(e) => setNewRole(e.target.value as RoleEnum)}
              >
                {Object.values(RoleEnum).map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              type="submit"
              onClick={() => handleRoleChange(selectedUser._id || '', newRole || selectedUser.role)}
            >
              {' '}
              Change Role
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
