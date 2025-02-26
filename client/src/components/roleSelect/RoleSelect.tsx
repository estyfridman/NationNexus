import {RoleEnum} from '../../models/enums/RoleEnum';
import {LABELS} from '../../../../shared/constants';
import {Button, Card, CardActions, CardContent, FormControl, InputLabel, MenuItem, Select, Typography} from '@mui/material';
import IUser from '../../models/interfaces/iUser';
import './roleSelect.scss';

interface RoleChangeCardProps {
  selectedUser: IUser;
  newRole: RoleEnum | null;
  setNewRole: React.Dispatch<React.SetStateAction<RoleEnum | null>>;
  handleRoleChange: (userId: string, newRole: RoleEnum) => void;
}

export default function RoleSelect({selectedUser, newRole, setNewRole, handleRoleChange}: RoleChangeCardProps) {
  return (
    <Card className='role-change-section'>
      <CardContent>
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
      </CardContent>
      <CardActions>
        <Button type='submit' onClick={() => handleRoleChange(selectedUser._id || '', newRole || selectedUser.role)}>
          {LABELS.CHANDE_ROLE}
        </Button>
      </CardActions>
    </Card>
  );
}
