import {Card, CardContent, Typography, Box, Button, CardActions} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {JUSTIFY_CENTER, MB2, PERMISSION_BOX, PERMISSION_CARD, WARNING_BOX, WARNING_ICON} from '../../constants/sxConstants';
import {LABELS} from '../../constants/constants';
import {requestPermissionsAlert} from '../../utils/sweet-alerts';
import {useNavigate} from 'react-router-dom';
import {userState} from '../../services/recoilService/userState';
import {useRecoilValue} from 'recoil';

function RestrictedPermissionsCard() {
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userState);

  return (
    <Box sx={PERMISSION_BOX}>
      <Card sx={PERMISSION_CARD}>
        <Box sx={WARNING_BOX}>
          <WarningAmberIcon color='warning' sx={WARNING_ICON} />
        </Box>
        <CardContent>
          <Typography variant='h6' color='text.secondary' gutterBottom>
            {LABELS.REST_PERMISSION}
          </Typography>
          <Typography variant='body1' sx={MB2}>
            {LABELS.BODY_REST_PERMISSION}
          </Typography>
        </CardContent>
        <CardActions sx={JUSTIFY_CENTER}>
          <Button
            variant='outlined'
            color='warning'
            onClick={() => {
              requestPermissionsAlert(navigate, currentUser.user?._id || '');
            }}>
            {LABELS.CONTACT_MANAGE}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default RestrictedPermissionsCard;
