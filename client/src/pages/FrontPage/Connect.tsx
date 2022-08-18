import { LoadingButton } from '@mui/lab';
import { Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAccount, setError, setSuccess } from '../../redux/appSlice';
import { eth } from '../../web3/provider';

export const Connect = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleOnConnect = () => {
    setLoading(true);
    eth
      .requestAccounts()
      .then((accounts) => {
        setLoading(false);
        dispatch(setAccount(accounts[0]));
        dispatch(setSuccess('Successfully connected with MetaMask'));
      })
      .catch((error) => {
        dispatch(
          setError('Failed to connect with MetaMask, try logging in again')
        );
        setLoading(false);
      });
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100%' }}
    >
      <Grid item sm={6} sx={{ textAlign: 'center' }}>
        <Typography>
          To enter the page please connect to the Ethereum network by connecting
          with your wallet using MetaMask.
        </Typography>
        <LoadingButton
          loading={loading}
          variant="contained"
          onClick={handleOnConnect}
          sx={{ mt: 2 }}
        >
          Enable Ethereum
        </LoadingButton>
      </Grid>
    </Grid>
  );
};
