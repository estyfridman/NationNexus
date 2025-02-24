import {useEffect, useState} from 'react';
import {IconButton, Typography, FormControl, InputLabel, Select, MenuItem, Button} from '@mui/material';
import IUser from '../../models/interfaces/iUser';
import Loading from '../loading/Loading';
import {DataGrid} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {useDeleteUser, useGetUsers, useGrantPermission} from '../../services/hooks/userHooks';
import {deleteAlert, errorDeleteAlert, successAlert, errorAlert} from '../../utils/sweet-alerts';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {userState} from '../../services/recoilService/userState';
import {initialUser} from '../../utils/initialValues';
import {useNavigate} from 'react-router-dom';
import {RoleEnum} from '../../../../shared/enums';
import './adminDashboard.scss';
import {selectedUserState} from '../../services/recoilService/selectedUserState';
import RequestsComponent from '../requestsComponent/RequestsComponent';
import {ALERT_MESSAGES, BUTTON_TEXT, LABELS} from '../../../../shared/constants';
import UserCard from '../userCard/UserCard';

export default function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(initialUser);
  const [newRole, setNewRole] = useState<RoleEnum | null>(null);
  const setSelectedUserState = useSetRecoilState(selectedUserState);

  const {data: users, isLoading, isError} = useGetUsers();
  const {mutate: grantPermission} = useGrantPermission();
  const deleteUserMutation = useDeleteUser();
  const {user} = useRecoilValue(userState);

  const navigate = useNavigate();

  const handleRoleChange = (userId: string, newRole: RoleEnum | null) => {
    if (!userId || !newRole || userId === '') {
      errorAlert(ALERT_MESSAGES.ERROR_UPDATE_ROLE);
      return;
    }
    grantPermission({userId, role: newRole});
    setNewRole(null);
  };

  const handleDelete = (event: React.MouseEvent, userId: string) => {
    event.stopPropagation();
    deleteAlert(() => {
      deleteUserMutation.mutate(userId, {
        onSuccess: () => {
          successAlert(ALERT_MESSAGES.SUCCESS_DELETE_USER);
        },
        onError: () => {
          errorDeleteAlert(ALERT_MESSAGES.ERROR_DELETE_USER);
        },
      });
    });
  };

  const handleEditClick = (user: IUser) => {
    setSelectedUserState(user);
    setNewRole(user.role);
    navigate(`/editUser/${user._id}`);
  };

  const columns = [
    {field: 'firstName', headerName: 'First Name', flex: 1, headerClassName: 'custom-header'},
    {field: 'lastName', headerName: 'Last Name', flex: 1, headerClassName: 'custom-header'},
    {field: 'email', headerName: 'Email', flex: 1, headerClassName: 'custom-header'},
    {field: 'phone', headerName: 'Phone', flex: 1, headerClassName: 'custom-header'},
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
            style={{marginRight: '8px'}}>
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
      <Typography className='admin-dashboard-title' variant='h2'>
        {BUTTON_TEXT.ADMIN}
      </Typography>
      <div style={{width: '98%'}}>
        <Typography className='admin-dashboard-title' variant='h4'>
          {BUTTON_TEXT.USERS}
        </Typography>
        {users && (
          <DataGrid
            rows={users}
            columns={columns}
            getRowId={(row) => row._id ?? crypto.randomUUID()}
            onRowClick={(params) => setSelectedUser(params.row)}
          />
        )}
      </div>
      <RequestsComponent />
      {selectedUser && selectedUser.firstName && (
        <div className='container'>
          <UserCard selectedUser={selectedUser} />
          <div className='role-change-section'>
            <Typography variant='h6'>
              {LABELS.CHANDE_ROLE_F} {selectedUser.firstName} {selectedUser.lastName}
            </Typography>
            <FormControl>
              <InputLabel id='role-select-label'>{LABELS.ROLE}</InputLabel>
              <Select
                labelId='role-select-label'
                id='role-select'
                value={newRole || selectedUser.role}
                label='Role'
                onChange={(e) => setNewRole(e.target.value as RoleEnum)}>
                {Object.values(RoleEnum).map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type='submit' onClick={() => handleRoleChange(selectedUser._id || '', newRole || selectedUser.role)}>
              {LABELS.CHANDE_ROLE}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
