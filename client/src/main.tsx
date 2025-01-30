import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.scss';
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './components/notFound/NotFound.tsx';
import EditForm from './components/editForm/EditForm.tsx';
import Grid from './components/grid/Grig.tsx';
import Layout from './Layout.tsx';
import ErrorBoundary from './ErrorBoundary.tsx'
import { RecoilRoot } from 'recoil';
import Login from './components/login/Login';
import Logout from './components/logout/Logout';
import SignUp from './components/signUp/signUp.tsx';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <App />,
      },
      {
        path: 'edit/:id',
        element: <EditForm />,
      },
      {
        path: 'grid',
        element: <Grid />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'logout',
        element: <Logout />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      }
    ],
  },
  {
    path: '*',
    element: <NotFound />
  }
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
  </StrictMode>,
)
