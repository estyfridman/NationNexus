import { useSetRecoilState } from 'recoil';
import { userState } from '../services/recoilService/userState';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const handleLogout = () => {
  const setUserState = useSetRecoilState(userState);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  navigate('/');
};
