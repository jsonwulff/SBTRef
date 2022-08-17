import { Outlet } from 'react-router-dom';
import AppBar from './AppBar';

export const Layout = () => {
  return (
    <div>
      <AppBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
