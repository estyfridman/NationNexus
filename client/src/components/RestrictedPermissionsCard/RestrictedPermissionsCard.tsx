import { Card, CardContent, Typography, Box, Button, CardActions } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

function RestrictedPermissionsCard() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          textAlign: 'center',
          p: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <WarningAmberIcon color="warning" sx={{ fontSize: 60 }} />
        </Box>
        <CardContent>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Restricted Permissions
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You don't have permission to edit users. Please contact your administrator for
            appropriate permissions{' '}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => {
              /* ניתן להוסיף פעולה כגון פנייה למנהל */
            }}
          >
            {' '}
            Contact a manager{' '}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default RestrictedPermissionsCard;
