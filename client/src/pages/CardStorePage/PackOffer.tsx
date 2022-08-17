import { LoadingButton } from '@mui/lab';
import { Grid, Paper, Skeleton, Typography } from '@mui/material';
import { useState } from 'react';
import { useAppSelector } from '../../redux/store';
import { buyPacks } from '../../web3/interfaces/TokenContract';
import { PackOfferType } from './CardStorePage';

export const PackOffer = ({ numCards, price, name }: PackOfferType) => {
  const account = useAppSelector((state) => state.app.account);
  const [loading, setLoading] = useState(false);

  const handleOnBuyPack = () => {
    setLoading(true);
    buyPacks(account, numCards)
      .once('receipt', (receipt: any) => {
        setLoading(false);
        console.log('Pack bought', receipt);
      })
      .once('error', (error: any) => {
        setLoading(false);
        console.log('Pack purchase failed', error);
      });
  };

  return (
    <Grid item sm={4}>
      <Paper sx={{ p: 1 }}>
        <Skeleton animation={false} variant="rectangular" height={200} />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mt: 1 }}>
          {name}
        </Typography>
        <Typography variant="body1">Contains {numCards} cards</Typography>
        <Typography variant="body2" gutterBottom>
          Price: {price} ETH
        </Typography>
        <LoadingButton
          loading={loading}
          variant="contained"
          color="success"
          fullWidth
          sx={{ mt: 1 }}
          onClick={handleOnBuyPack}
        >
          Buy pack
        </LoadingButton>
      </Paper>
    </Grid>
  );
};
