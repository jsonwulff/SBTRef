import {
  AppBar,
  Box,
  Paper,
  SelectChangeEvent,
  Tab,
  Tabs,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { SelectDropDown } from '../../../components/SelectDropDown';
import { cardSortBy } from '../../../constants/componentMappings';
import { Card } from '../../../redux/cardsSlice';
import { useAppSelector } from '../../../redux/store';
import { dynamicSort } from '../../../utils';
import { InventoryPanel } from './InventoryPanel';

export const Inventory = () => {
  const { traderCards, myCards } = useAppSelector((state) => ({
    traderCards: state.trade.traderCards,
    myCards: state.cards.myCards,
  }));
  const [value, setValue] = useState(0);
  const [sortBy, setSortBy] = useState<keyof Card>(cardSortBy[3].value);

  const sortedTraderCards = useMemo(
    () => [...traderCards].sort(dynamicSort(sortBy, 'desc')),
    [traderCards, sortBy]
  );
  const sortedMyCards = useMemo(
    () => [...myCards].sort(dynamicSort(sortBy, 'desc')),
    [myCards, sortBy]
  );

  const handleChangeSort = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as keyof Card);
  };

  const handleChangeIventory = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setValue(newValue);
  };

  return (
    <Box component={Paper} sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            variant="fullWidth"
            onChange={handleChangeIventory}
            aria-label="basic tabs example"
          >
            <Tab label="Your inventory" />
            <Tab label="Their inventory" />
          </Tabs>
        </AppBar>
      </Box>
      <Box sx={{ pt: 1.5, px: 1 }}>
        <SelectDropDown
          label="Sort by"
          value={sortBy}
          selectItems={cardSortBy}
          onChange={handleChangeSort}
          FormControlProps={{ fullWidth: true }}
        />
      </Box>
      <InventoryPanel
        value={value}
        index={0}
        cards={sortedMyCards}
        owner="yours"
      />
      <InventoryPanel
        value={value}
        index={1}
        cards={sortedTraderCards}
        owner="theirs"
      />
    </Box>
  );
};
