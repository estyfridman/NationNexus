import {useState, MouseEvent} from 'react';
import {AppBar, Typography, Box, IconButton, Menu, MenuItem, Toolbar, List, ListItem, ListItemText, Drawer, ListItemButton} from '@mui/material';
import {useRecoilValue} from 'recoil';
import {selectedCountryState} from '../../services/recoilService/selectedCountry';
import {useNavigate} from 'react-router-dom';
import {userState} from '../../services/recoilService/userState';
import {useLogoutMutation} from '../../services/hooks/useCurrentUser';
import {requestPermissionsAlert} from '../../utils/sweet-alerts';
import {NAVBAR_LINKS, PATH, BUTTON_TEXT, FUNCS} from '../../constants/constants';
import {RoleEnum} from '../../models/enums/RoleEnum';
import {linksBoxXs, appBarXs, menuXs, mdlSectionXs, toolbarXs} from '../../constants/sxConstants';
import MenuIcon from '@mui/icons-material/Menu';
import './navbar.scss';

export default function Navbar() {
  const selectedCountry = useRecoilValue(selectedCountryState);
  const navigate = useNavigate();
  const userData = useRecoilValue(userState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const apiPort = import.meta.env.VITE_API_PORT;
  const {mutate: logout} = useLogoutMutation();

  const handleLinkClick = (path: string) => {
    setDrawerOpen(false);
    handleMenuClose();
    navigate(path);
  };

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const userMenuItems = userData?.user
    ? [
        {text: BUTTON_TEXT.LOGOUT, action: handleLogout},
        {text: BUTTON_TEXT.PROFILE, action: () => handleLinkClick(FUNCS.EDIT_USER_NAVIGATE(userData.user?._id || ''))},
        {text: BUTTON_TEXT.PERMISSION, action: () => requestPermissionsAlert(navigate, userData.user?._id || '')},
      ]
    : [
        {text: BUTTON_TEXT.LOGIN, action: () => handleLinkClick(PATH.LOGIN)},
        {text: BUTTON_TEXT.REGISTER, action: () => handleLinkClick(PATH.REGISTER)},
      ];

  return (
    <AppBar position='static' sx={appBarXs}>
      <Toolbar sx={toolbarXs}>
        <IconButton edge='start' color='inherit' aria-label='menu' onClick={() => setDrawerOpen(true)} sx={menuXs}>
          <MenuIcon />
        </IconButton>
        <Box sx={linksBoxXs}>
          {[...NAVBAR_LINKS, userData?.user?.role === RoleEnum.ADMIN ? '/adminDashboard' : null].filter(Boolean).map((link) => (
            <MenuItem key={link} onClick={() => handleLinkClick(link!)}>
              {link!.replace('/', '').toUpperCase()}
            </MenuItem>
          ))}
        </Box>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
          <Typography className='customTypography' sx={mdlSectionXs}>
            {selectedCountry?.name ? `Selected Country: ${selectedCountry.name}` : 'Select a Country'}
          </Typography>
          <IconButton color='inherit' onClick={handleMenuOpen} className='imageWrapper'>
            {userData?.user && <Typography>{userData.user.username}</Typography>}
            <img
              src={userData?.user?.profileImage ? `${apiPort}${userData.user.profileImage}` : PATH.USER_IMG}
              alt={userData?.user?.firstName || 'User'}
              className='imgUser'
              onError={(e) => {
                (e.target as HTMLImageElement).src = PATH.USER_IMG;
              }}
            />
          </IconButton>
        </Box>
      </Toolbar>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {userMenuItems.map(({text, action}) => (
          <MenuItem key={text} onClick={action}>
            {text}
          </MenuItem>
        ))}
      </Menu>

      <Drawer anchor='left' open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List>
          {[...NAVBAR_LINKS, userData?.user?.role === RoleEnum.ADMIN ? '/adminDashboard' : null].filter(Boolean).map((link) => (
            <ListItem key={link} onClick={() => handleLinkClick(link!)}>
              <ListItemButton>{link!.replace('/', '').toUpperCase()}</ListItemButton>
            </ListItem>
          ))}
          {userMenuItems.map(({text, action}) => (
            <ListItem key={text} onClick={action}>
              <ListItemButton>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}
