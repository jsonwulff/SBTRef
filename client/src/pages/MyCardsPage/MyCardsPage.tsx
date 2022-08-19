import {
  Box,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Card, setMyCards } from '../../redux/cardsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { dynamicSort } from '../../utils';
import { getCardsWithStatsByOwner } from '../../web3/interfaces/TokenContract';
import { CardDisplay } from './CardDisplay';

const sortByItem: { text: string; property: keyof Card }[] = [
  { text: 'ID', property: 'id' },
  { text: 'Traded', property: 'traded' },
  { text: 'Type', property: 'cardType' },
  { text: 'Rarity', property: 'rarity' },
  { text: 'Strength', property: 'str' },
  { text: 'Defense', property: 'def' },
  { text: 'Health', property: 'hlt' },
];

export const MyCardsPage = () => {
  const { account, myCards } = useAppSelector((state) => ({
    account: state.app.account,
    myCards: state.cards.myCards,
  }));
  const dispatch = useAppDispatch();
  const [sortBy, setSortBy] = useState(sortByItem[3].property);

  useEffect(() => {
    getCardsWithStatsByOwner(account).then((result) => {
      dispatch(setMyCards(result));
    });
  }, [account, dispatch]);

  const handleChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as keyof Card);
  };

  return (
    <Container sx={{ pb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          My cards
        </Typography>
        <FormControl size="small">
          <InputLabel>Sort by</InputLabel>
          <Select value={sortBy} label="Sort by" onChange={handleChange}>
            {sortByItem.map((item) => (
              <MenuItem key={item.property} value={item.property}>
                {item.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Divider />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {[...myCards].sort(dynamicSort(sortBy, 'desc')).map((card) => (
          <Grid key={card.id} item xs={12} sm={6} md={4} lg={3}>
            <CardDisplay card={card} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
