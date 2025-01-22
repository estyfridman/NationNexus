import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.scss';
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './components/notFound/NotFound.tsx';
import EditForm from './components/editForm/EditForm.tsx';
import Grid from './components/grid/grig.tsx';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/edit',
    element: <EditForm />
  },
  {
    path: '/grid',
    element: <Grid />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
)
