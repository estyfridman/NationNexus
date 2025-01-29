import { AppBar, Typography, Link, Box } from '@mui/material';
import { useRecoilValue, useRecoilState } from 'recoil';
import { selectedCountryState } from '../../services/recoilService/selectedCountry';
import { useNavigate } from 'react-router-dom';
import './navbar.scss';
import { userState } from '../../services/recoilService/userState'

export default function Navbar() {
  const selectedCountry = useRecoilValue(selectedCountryState);
  const navigate = useNavigate();
  const userData = useRecoilValue(userState);

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    <AppBar position="static">
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', gap: 2, padding: '20px 24px', }}>
        <Link underline="none" color="inherit" onClick={() => handleLinkClick('/')} className='links'>
          Home
        </Link>
        <Link underline="none" color="inherit" onClick={() => handleLinkClick('/grid')}className='links'>
          Grid
        </Link>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {selectedCountry ? `Selected Country: ${selectedCountry.name}` : 'Please select a country'}
        </Typography>
      </Box>

      <div className='imageWrapper'>
            <img
              src={userData?.user.profileImage || "/Default_User.png"}
              alt={userData?.user.firstName}
              className='imgUser'
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/Default_User.png";
              }}
            />
          </div>

    </AppBar>
  );
}
