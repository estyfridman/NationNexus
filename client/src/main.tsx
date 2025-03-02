import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import NotFound from './components/notFound/NotFound.tsx';
import CountryForm from './components/countryForm/CountryForm.tsx';
import Grid from './components/grid/Grig.tsx';
import Layout from './Layout.tsx';
import ErrorBoundary from './ErrorBoundary.tsx';
import {RecoilRoot} from 'recoil';
import Login from './components/login/Login';
import UserForm from './components/userForm/UserForm.tsx';
import AdminDashboard from './components/adminDashboard/AdminDashboard.tsx';
import CitiesGrid from './components/cities/Cities.tsx';
import './styles/main.scss';
import {PATH} from './constants.ts';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: PATH.ROOT,
    element: <Layout />,
    children: [
      {
        path: '',
        element: <App />,
      },
      {
        path: PATH.HOME,
        element: <App />,
      },
      {
        path: PATH.EDIT,
        element: <CountryForm />,
      },
      {
        path: PATH.CREATE,
        element: <CountryForm />,
      },
      {
        path: PATH.COUNTRIES,
        element: <Grid />,
      },
      {
        path: PATH.CITIES_BY_COUNTRY,
        element: <CitiesGrid />,
      },
      {
        path: PATH.CITIES,
        element: <CitiesGrid />,
      },
      {
        path: PATH.LOGIN,
        element: <Login />,
      },
      {
        path: PATH.REGISTER,
        element: <UserForm />,
      },
      {
        path: PATH.EDIT_USER,
        element: <UserForm />,
      },
      {
        path: PATH.ADMIN_DASHBOARD,
        element: <AdminDashboard />,
      },
    ],
  },
  {
    path: PATH.NF,
    element: <NotFound />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <RouterProvider router={router} />
        </RecoilRoot>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
