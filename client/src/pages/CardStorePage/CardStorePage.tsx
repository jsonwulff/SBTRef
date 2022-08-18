import { Container, Divider, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { setPackCost } from '../../redux/cardsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { getPackCost, PackSize } from '../../web3/interfaces/TokenContract';
import { PackOffer } from './PackOffer';

export interface PackOfferType {
  name: string;
  numCards: PackSize;
  price: number;
}

const packOffers: PackOfferType[] = [
  { name: 'Small pack', numCards: 10, price: 1 },
  { name: 'Medium pack', numCards: 20, price: 2 },
  { name: 'Large pack', numCards: 50, price: 5 },
];

export const CardStorePage = () => {
  const account = useAppSelector((state) => state.app.account);
  const dispatch = useAppDispatch();

  useEffect(() => {
    getPackCost(account).then((result) => {
      dispatch(setPackCost(Number(result)));
    });
  }, [dispatch, account]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Card Store
      </Typography>
      <Divider />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {packOffers.map((offer) => (
          <PackOffer key={offer.numCards} {...offer} />
        ))}
      </Grid>
    </Container>
  );
};
