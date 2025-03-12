import {Navigate, Outlet} from 'react-router-dom';
import {useQueryClient} from '@tanstack/react-query';
import IUser from '../../models/interfaces/iUser';
import {PATH} from '../../constants';
import {RoleEnum} from '../../models/enums/RoleEnum';

const ProtectedRoute = () => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<IUser | undefined>(['user']);

  if (!user) {
    return <Navigate to={PATH.LOGIN} replace />;
  }

  if (user.role !== RoleEnum.ADMIN) {
    return <Navigate to={PATH.HOME} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
