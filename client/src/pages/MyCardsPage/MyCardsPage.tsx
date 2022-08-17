import { Container, Divider, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useAppSelector } from '../../redux/store';
import { getCardsWithStatsByOwner } from '../../web3/interfaces/TokenContract';

export const MyCardsPage = () => {
  const account = useAppSelector((state) => state.app.account);

  useEffect(() => {
    getCardsWithStatsByOwner(account).then((result: any) => {
      console.log(result);
    });
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Card Store
      </Typography>
      <Divider />
    </Container>
  );
};
