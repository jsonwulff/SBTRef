import { LoadingButton } from '@mui/lab';
import { Box, Grid, Paper, Skeleton, Typography } from '@mui/material';
import { useState } from 'react';
import { setError, setSuccess } from '../../redux/appSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { buyPacks } from '../../web3/interfaces/TokenContract';
import { web3 } from '../../web3/provider';
import { PackOfferType } from './CardStorePage';

export const PackOffer = ({ numCards, price, name }: PackOfferType) => {
  const { account, packCost } = useAppSelector((state) => ({
    account: state.app.account,
    packCost: state.cards.packCost,
  }));
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState('Buy pack');
  const dispatch = useAppDispatch();

  const handleOnBuyPack = () => {
    setLoading(true);
    setButtonText('Buying pack...');
    buyPacks(account, numCards)
      .once('receipt', (receipt: any) => {
        setLoading(false);
        setButtonText('Buy pack');
        dispatch(
          setSuccess(
            `Successfully bought ${name} for ${
              packCost
                ? web3.utils.fromWei((price * packCost).toString(), 'ether')
                : '?'
            } ETH. Go to "My cards" to see them.`
          )
        );
      })
      .once('error', (error: any) => {
        setLoading(false);
        setButtonText('Buy pack');
        dispatch(setError('Pack purchase failed, try again later.'));
        console.log('Pack purchase failed', error);
      });
  };

  return (
    <Grid item sm={4}>
      <Paper sx={{ p: 1, textAlign: 'center' }}>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <img
            alt="Under development"
            src={
              numCards === 10
                ? '/small.svg'
                : numCards === 20
                ? '/medium.svg'
                : '/large.svg'
            }
            style={{
              display: 'inline-block',
              maxWidth: '100%',
              width: 250,
            }}
          />
        </Box>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mt: 1 }}>
          {name}
        </Typography>
        <Typography variant="body1">Contains {numCards} cards</Typography>
        <Typography variant="body2" gutterBottom>
          Price:{' '}
          {packCost ? (
            web3.utils.fromWei((price * packCost).toString(), 'ether')
          ) : (
            <Skeleton
              variant="text"
              width={40}
              sx={{ fontSize: '1rem', display: 'inline-block' }}
            />
          )}{' '}
          ETH
        </Typography>
        <LoadingButton
          loading={loading}
          variant="contained"
          color="success"
          fullWidth
          sx={{ mt: 1 }}
          loadingPosition="start"
          onClick={handleOnBuyPack}
        >
          {buttonText}
        </LoadingButton>
      </Paper>
    </Grid>
  );
};
