import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h5">Are you sure you want to log out?</Typography>
      <Button color="secondary" variant="contained" fullWidth onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
};

export default Logout;
