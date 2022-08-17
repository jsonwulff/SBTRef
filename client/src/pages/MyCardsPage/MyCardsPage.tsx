import { Container, Divider, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { setMyCards } from '../../redux/cardsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { getCardsWithStatsByOwner } from '../../web3/interfaces/TokenContract';
import { CardDisplay } from './CardDisplay';

export const MyCardsPage = () => {
  const { account, myCards } = useAppSelector((state) => ({
    account: state.app.account,
    myCards: state.cards.myCards,
  }));
  const dispatch = useAppDispatch();

  useEffect(() => {
    getCardsWithStatsByOwner(account).then((result) => {
      dispatch(setMyCards(result));
    });
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        My cards
      </Typography>
      <Divider />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {myCards.map((card) => (
          <CardDisplay key={card.id} card={card} />
        ))}
      </Grid>
    </Container>
  );
};
