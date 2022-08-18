import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import { useStartApp } from '../../web3/hooks/useStartApp';
import { GlobalSnackBar } from '../GlobalSnackBar';
import AppBar from './AppBar';
import { Drawer } from './Drawer';

export const Layout = () => {
  const { registered } = useAppSelector((state) => state.app);

  useStartApp();
  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <AppBar />
      {registered && <Drawer />}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}
      >
        <Toolbar />
        <Outlet />
      </Box>
      <GlobalSnackBar />
    </Box>
  );
};
