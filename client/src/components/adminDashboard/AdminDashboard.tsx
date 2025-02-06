import { useState } from 'react';
import { Typography, Box, Button, Select, MenuItem, IconButton, Avatar } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import IUser from '../../models/iUser';
import Loading from '../loading/Loading';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useDeleteUser,
  useGetUsers,
  useGrantPermission,
  useUpdateUser,
} from '../../services/hooks/userHooks';
import { errorAlert } from '../../utils/sweet-alerts';
import { useRecoilValue } from 'recoil';
import { userState } from '../../services/recoilService/userState';
import { initialUser } from '../../utils/initialValues';
import { useNavigate } from 'react-router-dom';
import { userSchema } from '../../models/schemas/userSchema';

export default function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const { data: users, isLoading, isError } = useGetUsers();
  const { mutate: grantPermission } = useGrantPermission();
  const { mutate: updateUserMutation } = useUpdateUser();
  const { mutate: deleteUserMutation } = useDeleteUser();
  const { user } = useRecoilValue(userState);
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    navigate('/');
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    if (!['admin', 'user', 'guest'].includes(newRole)) return;
    grantPermission({ userId, role: newRole as 'admin' | 'user' | 'guest' });
  };

  const handleDelete = (event: React.MouseEvent, userId: string) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation(userId);
    }
  };

  const formik = useFormik<IUser>({
    initialValues: selectedUser || initialUser,
    enableReinitialize: true,
    validationSchema: userSchema,
    onSubmit: (values) => {
      if (!selectedUser?._id) {
        errorAlert();
        return;
      }
      updateUserMutation(
        { id: selectedUser._id, updatedData: values },
        {
          onError: (error) => {
            errorAlert('Failed to update user. try again later...');
          },
        }
      );
      setSelectedUser(null);
    },
  });

  const columns = [
    { field: 'firstName', headerName: 'First Name', flex: 1, headerClassName: 'custom-header' },
    { field: 'lastName', headerName: 'Last Name', flex: 1, headerClassName: 'custom-header' },
    { field: 'username', headerName: 'Username', flex: 1, headerClassName: 'custom-header' },
    { field: 'email', headerName: 'Email', flex: 1, headerClassName: 'custom-header' },
    { field: 'phone', headerName: 'Phone', flex: 1, headerClassName: 'custom-header' },
    {
      field: 'profileImage',
      headerName: 'Profile',
      flex: 1,
      headerClassName: 'custom-header',
      renderCell: (params: any) =>
        params.value ? <Avatar src={params.value} alt="Profile" /> : 'No Image',
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      headerClassName: 'custom-header',
      renderCell: (params: any) => (
        <Select
          value={params.value}
          onChange={(e) => handleRoleChange(params.row._id, e.target.value)}
          fullWidth
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="guest">Guest</MenuItem>
        </Select>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1,
      headerClassName: 'custom-header',
      renderCell: (params: any) => new Date(params.value).toLocaleDateString(),
    },
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
              handleEdit(params.row);
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

  const handleEdit = (user: IUser) => {
    setSelectedUser(user);
  };

  if (isLoading) return <Loading />;
  if (isError) return;

  return (
    <div>
      <div>Admin Dashboard</div>
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

      {selectedUser && (
        <Box mt={3}>
          <Typography variant="h5">Edit User</Typography>
          <form onSubmit={formik.handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <input type="text" placeholder="First Name" {...formik.getFieldProps('firstName')} />
              <input type="text" placeholder="Last Name" {...formik.getFieldProps('lastName')} />
              <input type="text" placeholder="Username" {...formik.getFieldProps('username')} />
              <input type="email" placeholder="Email" {...formik.getFieldProps('email')} />
              <input type="tel" placeholder="Phone" {...formik.getFieldProps('phone')} />
              <input type="password" placeholder="Password" {...formik.getFieldProps('password')} />
              <input
                type="text"
                placeholder="Profile Image URL"
                {...formik.getFieldProps('profileImage')}
              />
              <select {...formik.getFieldProps('role')}>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="guest">Guest</option>
              </select>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => setSelectedUser(null)}>
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </div>
  );
}
