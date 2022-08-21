import {
  Box,
  Container,
  Divider,
  Grid,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { SelectDropDown } from '../../components/SelectDropDown';
import { cardSortBy } from '../../constants/componentMappings';
import { Card, setMyCards } from '../../redux/cardsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { dynamicSort } from '../../utils';
import { getCardsWithStatsByOwner } from '../../web3/interfaces/TokenContract';
import { CardDisplay } from './CardDisplay';

export const MyCardsPage = () => {
  const { account, myCards } = useAppSelector((state) => ({
    account: state.app.account,
    myCards: state.cards.myCards,
  }));
  const dispatch = useAppDispatch();
  const [sortBy, setSortBy] = useState<keyof Card>(cardSortBy[3].value);

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
        <SelectDropDown
          label="Sort by"
          value={sortBy}
          selectItems={cardSortBy}
          onChange={handleChange}
        />
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
