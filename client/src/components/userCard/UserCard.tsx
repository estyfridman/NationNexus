import {PATH, LABELS} from '../../../../shared/constants';
import {Typography, Card, CardMedia, CardContent, Box} from '@mui/material';
import {generateCurrentPath} from '../../utils/generateCurrentPath';
import IUser from '../../models/interfaces/iUser';
import './userCard.scss';

interface UserCardProps {
  selectedUser: IUser;
}

export default function UserCard({selectedUser}: UserCardProps) {
  return (
    <>
      <Card sx={{display: 'flex'}} className='user-details-card'>
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
          <CardContent sx={{flex: '1 0 auto'}}>
            <Typography variant='h6' component='div'>
              {selectedUser.firstName} {selectedUser.lastName}
            </Typography>
            <Typography variant='subtitle1'>
              {LABELS.USER_NAME}: {selectedUser.username}
            </Typography>
            <Box sx={{alignItems: 'left', marginTop: '2rem'}}>
              <Typography variant='body2'>
                {LABELS.EMAIL}: {selectedUser.email}
              </Typography>
              <Typography variant='body2'>
                {LABELS.PHONE}: {selectedUser.phone}
              </Typography>
              <Typography variant='body2'>
                {LABELS.ROLE}: {selectedUser.role}
              </Typography>
              <Typography variant='body2'>
                {LABELS.CREATED}: {new Date(selectedUser.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </CardContent>
        </Box>
        <CardMedia
          component='img'
          className='user-avatar'
          height='100'
          image={generateCurrentPath(selectedUser.profileImage) || PATH.USER_IMG}
          alt={`${selectedUser.firstName} ${selectedUser.lastName} Profile`}
        />
      </Card>
    </>
  );
}
