import {useState, MouseEvent} from 'react';
import {
  AppBar,
  Typography,
  Link,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  Drawer,
  ListItemButton,
} from '@mui/material';
import {useRecoilValue} from 'recoil';
import {selectedCountryState} from '../../services/recoilService/selectedCountry';
import {useNavigate} from 'react-router-dom';
import './navbar.scss';
import {userState} from '../../services/recoilService/userState';
import {useLogoutMutation} from '../../services/hooks/useCurrentUser';
import {requestPermissionsAlert} from '../../utils/sweet-alerts';
import {NAVBAR_LINKS, PATH, LABELS, BUTTON_TEXT, FUNCS} from '../../constants/constants';
import {RoleEnum} from '../../models/enums/RoleEnum';
import {linksBoxXs, appBarXs, menuXs, mdlSectionXs, toolbarXs} from '../../constants/sxConstants';
import MenuIcon from '@mui/icons-material/Menu';

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

  function handleLogout() {
    logout();
    handleMenuClose();
    navigate('/');
  }

  return (
    <AppBar position='static' sx={appBarXs}>
      <Toolbar sx={toolbarXs}>
        <IconButton edge='start' color='inherit' aria-label='menu' onClick={() => setDrawerOpen(true)} sx={menuXs}>
          <MenuIcon />
        </IconButton>
        <Box sx={linksBoxXs}>
          {NAVBAR_LINKS.map((link) => {
            return (
              <Link key={link} underline='none' color='inherit' onClick={() => handleLinkClick(link)} className='links'>
                {link.replace('/', '').toUpperCase()}
              </Link>
            );
          })}

          {userData && userData?.user?.role === RoleEnum.ADMIN && (
            <Link underline='none' color='inherit' onClick={() => handleLinkClick('/adminDashboard')} className='links'>
              {BUTTON_TEXT.ADMIN}
            </Link>
          )}
        </Box>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
          <Typography className='customTypography' sx={mdlSectionXs}>
            {selectedCountry && selectedCountry.name ? ` ${LABELS.SELECTED_COUNTRY} ${selectedCountry.name}` : LABELS.TO_SELECT_COUNTRY}
          </Typography>
          <IconButton color='inherit' onClick={handleMenuOpen} className='imageWrapper'>
            {userData && userData.user && <Typography>{userData.user.username}</Typography>}
            <img
              src={userData?.user?.profileImage ? `${apiPort}${userData.user.profileImage}` : PATH.USER_IMG}
              alt={userData?.user?.firstName}
              className='imgUser'
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = PATH.USER_IMG;
              }}
            />
          </IconButton>
        </Box>
      </Toolbar>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {userData && userData.user !== null ? (
          <>
            <MenuItem onClick={handleLogout} className='links'>
              {BUTTON_TEXT.LOGOUT}
            </MenuItem>
            <MenuItem onClick={() => handleLinkClick(FUNCS.EDIT_USER(userData.user?._id))} className='links'>
              {BUTTON_TEXT.PROFILE}
            </MenuItem>
            <MenuItem onClick={() => requestPermissionsAlert(navigate, userData.user?._id || '')} className='links'>
              {BUTTON_TEXT.PERMISSION}
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => handleLinkClick(PATH.LOGIN)} className='links'>
              {BUTTON_TEXT.LOGIN}
            </MenuItem>
            <MenuItem onClick={() => handleLinkClick(PATH.REGISTER)} className='links'>
              {BUTTON_TEXT.REGISTER}
            </MenuItem>
          </>
        )}
      </Menu>
      <Drawer anchor='left' open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List>
          {NAVBAR_LINKS.map((link) => (
            <ListItem key={link} onClick={() => handleLinkClick(link)}>
              <ListItemButton>{link.replace('/', '').toUpperCase()}</ListItemButton>
            </ListItem>
          ))}
          {userData?.user?.role === RoleEnum.ADMIN && (
            <ListItem onClick={() => handleLinkClick('/adminDashboard')}>
              <ListItemButton> {BUTTON_TEXT.ADMIN} </ListItemButton>
            </ListItem>
          )}
          {userData && userData.user !== null ? (
            <>
              <ListItem onClick={handleLogout}>
                <ListItemButton>
                  <ListItemText primary={BUTTON_TEXT.LOGOUT} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleLinkClick(`/editUser/${userData.user?._id}`)}>
                  <ListItemText primary={BUTTON_TEXT.PROFILE} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => requestPermissionsAlert(navigate, userData.user?._id || '')}>
                  <ListItemText primary={BUTTON_TEXT.PERMISSION} />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem onClick={() => handleLinkClick('/login')}>
                <ListItemButton>
                  <ListItemText primary={BUTTON_TEXT.LOGIN.toUpperCase()} />
                </ListItemButton>
              </ListItem>
              <ListItem onClick={() => handleLinkClick('/register')}>
                <ListItemButton>{BUTTON_TEXT.REGISTER.toUpperCase()}</ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
}
