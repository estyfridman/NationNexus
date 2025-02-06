import Navbar from './components/navbar/Navbar';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../src/services/hooks/AuthProvider';

export default function Layout() {
  useAuth();

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
