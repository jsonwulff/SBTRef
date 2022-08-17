import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import { useState } from 'react';
import { useAppSelector } from '../../redux/store';
import { register } from '../../web3/interfaces/PlayerRegistryContract';

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const account = useAppSelector((state) => state.app.account);

  const handleOnRegister = () => {
    setLoading(true);
    register(account)
      .once('receipt', (receipt: any) => {
        setLoading(false);
        console.log('user succesfully registered', receipt);
      })
      .once('error', (error: any) => {
        setLoading(false);
        console.log('error while registering', error);
      });
  };

  return (
    <div>
      <Typography>
        You are not registered, please register to continue
      </Typography>
      <LoadingButton
        loading={loading}
        variant="contained"
        onClick={handleOnRegister}
      >
        Register account
      </LoadingButton>
    </div>
  );
};
