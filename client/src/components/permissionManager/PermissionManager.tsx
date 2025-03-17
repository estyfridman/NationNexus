import {useState} from 'react';
import {Button, Card, CardActions, CardContent, FormControl, InputLabel, MenuItem, Select, Typography} from '@mui/material';
import {useGetUsers, useUpdatePermissionUser} from '../../services/hooks/useUsers';
import {PermissionEnum} from '../../models/enums/permissionEnum';
import Loading from '../loading/Loading';
import IUser from '../../models/interfaces/iUser';
import {FIELD, LABELS} from '../../constants/constants';

export default function PermissionManager() {
  const {data: users, isLoading} = useGetUsers();
  const updateUserPermissionsMutation = useUpdatePermissionUser();

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [selectedPermission, setSelectedPermission] = useState<PermissionEnum>(PermissionEnum.VIEW);
  const [action, setAction] = useState<'ADD' | 'REMOVE'>('ADD');

  if (isLoading) return <Loading />;

  const handleUpdatePermission = () => {
    console.log(selectedUser);
    console.log(selectedPermission);
    if (!selectedUser || !selectedPermission) return;

    updateUserPermissionsMutation.mutate({
      id: selectedUser._id || '',
      permission: selectedPermission,
      action,
    });
  };

  return (
    <Card className='permission-card'>
      <CardContent>
        <Typography variant='h6'>{LABELS.MANAGE_USERS}</Typography>

        <FormControl fullWidth margin='normal'>
          <InputLabel>{FIELD.USER}</InputLabel>
          <Select
            value={selectedUser?._id || ''}
            onChange={(e) => {
              const user = users?.find((u) => u._id === e.target.value) || null;
              setSelectedUser(user);
            }}>
            {users?.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedUser && (
          <FormControl fullWidth margin='normal'>
            <InputLabel>{FIELD.PERMISSION}</InputLabel>
            <Select value={selectedPermission} onChange={(e) => setSelectedPermission(e.target.value as PermissionEnum)}>
              {Object.values(PermissionEnum)
                // .filter((perm) => !selectedUser?.permissions?.includes(perm)) Add the filter only if synchronized with the add or remove option
                .map((perm) => (
                  <MenuItem key={perm} value={perm}>
                    {perm}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}

        <FormControl fullWidth margin='normal'>
          <InputLabel>{FIELD.ACTION}</InputLabel>
          <Select value={action} onChange={(e) => setAction(e.target.value as 'ADD' | 'REMOVE')}>
            <MenuItem value='ADD'>{FIELD.ADD}</MenuItem>
            <MenuItem value='REMOVE'>{FIELD.REMOVE}</MenuItem>
          </Select>
        </FormControl>
      </CardContent>
      <CardActions>
        <Button color='primary' onClick={handleUpdatePermission}>
          {FIELD.GRANT}
        </Button>
      </CardActions>
    </Card>
  );
}
