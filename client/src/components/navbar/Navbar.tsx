import { useState, MouseEvent } from 'react';
import { AppBar, Typography, Link, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { selectedCountryState } from '../../services/recoilService/selectedCountry';
import { useNavigate } from 'react-router-dom';
import './navbar.scss';
import { userState } from '../../services/recoilService/userState';

export default function Navbar() {
  const selectedCountry = useRecoilValue(selectedCountryState);
  const navigate = useNavigate();
  const userData = useRecoilValue(userState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
        {userData?.user.role === 'admin' && (
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
        <IconButton color="inherit" onClick={handleMenuOpen} className="imageWrapper">
          <img
            src={userData?.user.profileImage || '/Default_User.png'}
            alt={userData?.user.firstName}
            className="imgUser"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/Default_User.png';
            }}
          />
        </IconButton>
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {userData ? (
          <>
            <MenuItem onClick={() => handleLinkClick('/logout')} className="links">
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
