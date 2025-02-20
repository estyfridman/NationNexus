import { useState, MouseEvent } from 'react';
import { AppBar, Typography, Link, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { selectedCountryState } from '../../services/recoilService/selectedCountry';
import { useNavigate } from 'react-router-dom';
import './navbar.scss';
import { userState } from '../../services/recoilService/userState';
import { useLogoutMutation } from '../../services/hooks/userMutations/useLogoutMutation';
import { requestPermissionsAlert } from '../../utils/sweet-alerts';

const links = ['/home', '/countries', '/cities'];

export default function Navbar() {
  const selectedCountry = useRecoilValue(selectedCountryState);
  const navigate = useNavigate();
  const userData = useRecoilValue(userState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const apiPort = import.meta.env.VITE_API_PORT;
  const { mutate: logout } = useLogoutMutation();

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
    logout();
    handleMenuClose();
    navigate('/');
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#3a506b' }}>
      <Box
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', gap: 3, padding: '10px 30px' }}
      >
        {links.map((link) => {
          return (
            <Link
              key={link}
              underline="none"
              color="inherit"
              onClick={() => handleLinkClick(link)}
              className="links"
            >
              {link.replace('/', '').toUpperCase()}
            </Link>
          );
        })}

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
          {selectedCountry && selectedCountry.name
            ? `Selected Country: ${selectedCountry.name}`
            : 'Please select a country'}
        </Typography>
        {userData && userData.user && <Typography>{userData.user.username}</Typography>}
        <IconButton color="inherit" onClick={handleMenuOpen} className="imageWrapper">
          <img
            src={
              userData?.user?.profileImage
                ? `${apiPort}${userData.user.profileImage}`
                : '/images/Default_User.jpg'
            }
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
            <MenuItem
              onClick={() => handleLinkClick(`/editUser/${userData.user?._id}`)}
              className="links"
            >
              Edit Profile
            </MenuItem>
            <MenuItem
              onClick={() => requestPermissionsAlert(navigate, userData.user?._id || '')}
              className="links"
            >
              Request for permissions
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => handleLinkClick('/login')} className="links">
              Login
            </MenuItem>
            <MenuItem onClick={() => handleLinkClick('/register')} className="links">
              Register
            </MenuItem>
          </>
        )}
      </Menu>
    </AppBar>
  );
}
