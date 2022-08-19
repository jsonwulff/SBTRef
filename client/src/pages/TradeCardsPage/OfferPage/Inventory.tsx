import { AppBar, Box, Paper, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useAppSelector } from '../../../redux/store';
import { InventoryPanel } from './InventoryPanel';

export const Inventory = () => {
  const [value, setValue] = useState(0);
  const { traderCards, myCards } = useAppSelector((state) => ({
    traderCards: state.trade.traderCards,
    myCards: state.cards.myCards,
  }));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box component={Paper} sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            variant="fullWidth"
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Your inventory" />
            <Tab label="Their inventory" />
          </Tabs>
        </AppBar>
      </Box>
      <InventoryPanel value={value} index={0} cards={myCards} />
      <InventoryPanel value={value} index={1} cards={traderCards} />
    </Box>
  );
};
