import {useEffect, useState} from 'react';
import {IconButton, Typography, Button} from '@mui/material';
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
import {RoleEnum} from '../../models/enums/RoleEnum';
import './adminDashboard.scss';
import {selectedUserState} from '../../services/recoilService/selectedUserState';
import RequestsComponent from '../requestsComponent/RequestsComponent';
import {ALERT_MESSAGES, BUTTON_TEXT, LABELS, PATH, FUNCS, FIELD} from '../../constants';
import UserCard from '../userCard/UserCard';
import RoleSelect from '../roleSelect/RoleSelect';

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
          errorDeleteAlert(ALERT_MESSAGES.ERROR_DELETE);
        },
      });
    });
  };

  const handleEditClick = (user: IUser) => {
    setSelectedUserState(user);
    setNewRole(user.role);
    navigate(FUNCS.EDIT_USER_NAVIGATE(user._id || ''));
  };

  const columns = [
    {field: FIELD.FIRST_NAME, headerName: LABELS.FIRST_NAME},
    {field: FIELD.LAST_NAME, headerName: LABELS.LAST_NAME},
    {field: FIELD.EMAIL, headerName: LABELS.EMAIL},
    {field: FIELD.PHONE, headerName: LABELS.PHONE},
    {
      field: FIELD.ACTIONS,
      headerName: FIELD.ACTIONS,
      sortable: false,
      renderCell: (params: any) => (
        <>
          <IconButton
            className='icon-edit'
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(params.row);
            }}>
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
      navigate(PATH.ROOT);
    }
  }, [user, navigate]);

  if (isLoading) return <Loading />;
  if (isError) return;

  //TODO: למחוק את קונטיינר אם לא מוסיפה לו עיצוב

  return (
    <div className='container'>
      <Typography className='admin-dashboard-title' variant='h2'>
        {BUTTON_TEXT.ADMIN}
      </Typography>
      <div className='users-container'>
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
        <Button onClick={() => navigate(PATH.REGISTER)} className='links'>
          {LABELS.CREATE_USER}
        </Button>
      </div>
      <RequestsComponent />
      {selectedUser && selectedUser.firstName && (
        <div className='user-detail-container'>
          <UserCard selectedUser={selectedUser} />
          <RoleSelect selectedUser={selectedUser} newRole={newRole} setNewRole={setNewRole} handleRoleChange={handleRoleChange} />
        </div>
      )}
    </div>
  );
}
