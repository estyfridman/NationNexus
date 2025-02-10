import { useEffect, useState } from 'react';
import { IconButton, Avatar } from '@mui/material';
import { useFormik } from 'formik';
import IUser from '../../models/interfaces/iUser';
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
  const [selectedUser, setSelectedUser] = useState<IUser | null>(initialUser);
  const { data: users, isLoading, isError } = useGetUsers();
  const { mutate: grantPermission } = useGrantPermission();
  const { mutate: deleteUserMutation } = useDeleteUser();
  const { user } = useRecoilValue(userState);

  const navigate = useNavigate();

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
              handleSelectedUser(params.row);
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
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  function handleSelectedUser(user: IUser) {
    setSelectedUser(user);
    navigate(`/editUser/${user._id}`);
  }

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
            onRowClick={(params) => handleSelectedUser(params.row)}
          />
        )}
      </div>
    </div>
  );
}
