import { LoadingButton } from '@mui/lab';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setError, setSuccess } from '../../redux/appSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import {
  lookupUsername,
  register,
} from '../../web3/interfaces/PlayerRegistryContract';

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState('');
  const [TFError, setTFError] = useState(false);
  const [buttonText, setButtonText] = useState('Register account');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const account = useAppSelector((state) => state.app.account);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
    if (TFError) setTFError(false);
  };

  const handleOnRegister = () => {
    if (!nickname) {
      setTFError(true);
      dispatch(setError('Please enter a nickname'));
      return;
    }
    setLoading(true);
    setButtonText('Checking availability...');
    lookupUsername(nickname, account).then((result) => {
      if (parseInt(result, 16) !== 0) {
        setLoading(false);
        setTFError(true);
        setButtonText('Register account');
        setNickname('');
        dispatch(setError('Nickname already taken, please choose another one'));
      } else {
        setButtonText('Registering account...');
        register(nickname, account)
          .once('receipt', (receipt: any) => {
            dispatch(setSuccess('Account successfully registered'));
            navigate('/app');
          })
          .once('error', (error: any) => {
            setLoading(false);
            setTFError(true);
            setButtonText('Register account');
            dispatch(setError('Failed to register account, please try again'));
            console.log('Error while registering:', error);
          });
      }
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
          You are not registered, please select a nickname to register and
          continue
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            label="Your nickname"
            placeholder="e.g. CryptNorris"
            value={nickname}
            error={TFError}
            onChange={handleChange}
            margin="normal"
            size="small"
          />
          <LoadingButton
            loading={loading}
            loadingPosition="start"
            variant="contained"
            onClick={handleOnRegister}
          >
            {buttonText}
          </LoadingButton>
        </Box>
      </Grid>
    </Grid>
  );
};
