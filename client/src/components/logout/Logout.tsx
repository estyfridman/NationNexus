import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic here, e.g., clearing user data or token
    localStorage.removeItem('userToken'); // Clear stored token
    navigate('/login'); // Redirect to login page after logout
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
