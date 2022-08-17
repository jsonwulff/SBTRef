import { Container, Divider, Grid, Typography } from '@mui/material';
import { PackSize } from '../../web3/interfaces/TokenContract';
import { PackOffer } from './PackOffer';

export interface PackOfferType {
  name: string;
  numCards: PackSize;
  price: number;
}

const packOffers: PackOfferType[] = [
  { name: 'Small pack', numCards: 10, price: 10 },
  { name: 'Medium pack', numCards: 20, price: 20 },
  { name: 'Large pack', numCards: 50, price: 50 },
];

export const CardStorePage = () => {
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
