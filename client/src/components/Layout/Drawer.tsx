import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreRoundedIcon from '@mui/icons-material/StoreRounded';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import {
  Box,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  {
    text: 'Dashoard',
    icon: <DashboardIcon />,
    link: 'dashboard',
  },
  {
    text: 'My Cards',
    icon: <AppsRoundedIcon />,
    link: 'my-cards',
  },
  {
    text: 'Card store',
    icon: <StoreRoundedIcon />,
    link: 'card-store',
  },
  {
    text: 'Trade cards',
    icon: <SwapHorizRoundedIcon />,
    link: 'trade-cards',
  },
  {
    text: 'My profile',
    icon: <AccountBoxRoundedIcon />,
    link: 'my-profile',
  },
];

export const Drawer = () => {
  const navigate = useNavigate();
  return (
    <MuiDrawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={item.link} disablePadding>
              <ListItemButton onClick={() => navigate(item.link)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </MuiDrawer>
  );
};
