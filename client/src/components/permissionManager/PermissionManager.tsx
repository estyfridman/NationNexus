import {useState} from 'react';
import {Button, Card, CardActions, CardContent, FormControl, InputLabel, MenuItem, Select, Typography} from '@mui/material';
import {useGetUsers, useUpdatePermissionUser} from '../../services/hooks/useUsers';
import {PermissionEnum} from '../../models/enums/permissionEnum';
import Loading from '../loading/Loading';
import IUser from '../../models/interfaces/iUser';

export default function PermissionManager() {
  const {data: users, isLoading} = useGetUsers();
  const updateUserPermissionsMutation = useUpdatePermissionUser();

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [selectedPermission, setSelectedPermission] = useState<PermissionEnum | ''>('');
  const [action, setAction] = useState<'ADD' | 'REMOVE'>('ADD');

  if (isLoading) return <Loading />;

  const handleUpdatePermission = () => {
    console.log(selectedUser);
    console.log(selectedPermission);
    if (!selectedUser || !selectedPermission) return;

    const results = updateUserPermissionsMutation.mutate({
      id: selectedUser._id || '',
      permission: selectedPermission,
      action,
    });
    console.log(results);
  };

  return (
    <Card className='permission-card'>
      <CardContent>
        <Typography variant='h6'>Manage User Permissions</Typography>

        <FormControl fullWidth margin='normal'>
          <InputLabel>User</InputLabel>
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
            <InputLabel>Permission</InputLabel>
            <Select value={selectedPermission} onChange={(e) => setSelectedPermission(e.target.value as PermissionEnum)}>
              {Object.values(PermissionEnum)
                .filter((perm) => !selectedUser?.permissions?.includes(perm))
                .map((perm) => (
                  <MenuItem key={perm} value={perm}>
                    {perm}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}

        <FormControl fullWidth margin='normal'>
          <InputLabel>Action</InputLabel>
          <Select value={action} onChange={(e) => setAction(e.target.value as 'ADD' | 'REMOVE')}>
            <MenuItem value='ADD'>Add Permission</MenuItem>
            <MenuItem value='REMOVE'>Remove Permission</MenuItem>
          </Select>
        </FormControl>
      </CardContent>
      <CardActions>
        <Button color='primary' onClick={handleUpdatePermission}>
          Grant Permission
        </Button>
      </CardActions>
    </Card>
  );
}
