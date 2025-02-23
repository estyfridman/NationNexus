import {PATH, LABELS} from '../../../../shared/constants';
import {Typography, Card, CardMedia, CardContent} from '@mui/material';
import {generateCurrentPath} from '../../utils/generateCurrentPath';
import IUser from '../../models/interfaces/iUser';

interface UserCardProps {
  selectedUser: IUser;
}

export default function UserCard({selectedUser}: UserCardProps) {
  return (
    <>
      <Card className='user-details-card'>
        <CardMedia
          component='img'
          height='100'
          image={generateCurrentPath(selectedUser.profileImage) || PATH.USER_IMG}
          alt={`${selectedUser.firstName} ${selectedUser.lastName} Profile`}
        />
        <CardContent>
          <Typography variant='h6' component='div'>
            {selectedUser.firstName} {selectedUser.lastName}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {LABELS.USER_NAME}: {selectedUser.username}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {LABELS.EMAIL}: {selectedUser.email}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {LABELS.PHONE}: {selectedUser.phone}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {LABELS.ROLE}: {selectedUser.role}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {LABELS.CREATED}: {new Date(selectedUser.createdAt).toLocaleDateString()}{' '}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}
