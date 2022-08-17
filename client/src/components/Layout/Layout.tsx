import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import AppBar from './AppBar';
import { Drawer } from './Drawer';

export const Layout = () => {
  const { account, registered } = useAppSelector((state) => state.app);
  return (
    <Box sx={{ display: 'fixed' }}>
      <AppBar />
      {registered && <Drawer />}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
