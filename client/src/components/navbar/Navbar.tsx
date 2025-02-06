import { useState, MouseEvent } from 'react';
import { AppBar, Typography, Link, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { selectedCountryState } from '../../services/recoilService/selectedCountry';
import { useNavigate } from 'react-router-dom';
import './navbar.scss';
import { userState } from '../../services/recoilService/userState';
import { useQueryClient } from '@tanstack/react-query';

export default function Navbar() {
  const selectedCountry = useRecoilValue(selectedCountryState);
  const navigate = useNavigate();
  const userData = useRecoilValue(userState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const queryClient = useQueryClient();
  const setUserState = useSetRecoilState(userState);

  const handleLinkClick = (path: string) => {
    handleMenuClose();
    navigate(path);
  };

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  function handleLogout() {
    setUserState({
      user: {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        profileImage: '',
        role: 'guest',
        createdAt: new Date(),
      },
      token: '',
    });

    queryClient.invalidateQueries({
      queryKey: ['Users'],
    });
    handleMenuClose();
    navigate('/');
  }

  return (
    <AppBar position="static">
      <Box
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', gap: 2, padding: '20px 24px' }}
      >
        <Link
          underline="none"
          color="inherit"
          onClick={() => handleLinkClick('/')}
          className="links"
        >
          Home
        </Link>
        <Link
          underline="none"
          color="inherit"
          onClick={() => handleLinkClick('/grid')}
          className="links"
        >
          Grid
        </Link>
        {userData && userData?.user?.role === 'admin' && (
          <Link
            underline="none"
            color="inherit"
            onClick={() => handleLinkClick('/adminDashboard')}
            className="links"
          >
            Admin Dashboard
          </Link>
        )}
        <Typography component="div" className="customTypography">
          {selectedCountry
            ? `Selected Country: ${selectedCountry.name}`
            : 'Please select a country'}
        </Typography>
        {userData ? userData.user?.username : 'no user'}
        <IconButton color="inherit" onClick={handleMenuOpen} className="imageWrapper">
          <img
            src={userData?.user?.profileImage || '/images/Default_User.jpg'}
            alt={userData?.user?.firstName}
            className="imgUser"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/images/Default_User.jpg';
            }}
          />
        </IconButton>
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {userData && userData.user !== null ? (
          <>
            <MenuItem onClick={handleLogout} className="links">
              Log Out
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => handleLinkClick('/login')} className="links">
              Login
            </MenuItem>
            <MenuItem onClick={() => handleLinkClick('/signin')} className="links">
              Sign In
            </MenuItem>
          </>
        )}
      </Menu>
    </AppBar>
  );
}
