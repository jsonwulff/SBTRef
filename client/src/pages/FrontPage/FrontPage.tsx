import { Container, Typography } from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import { LocationWithState } from '../../routes/RequireRegistered';
import { Register } from './Register';

export const FrontPage = () => {
  const { account, error, registered } = useAppSelector((state) => state.app);
  const location = useLocation() as LocationWithState;
  const from = location.state?.from?.pathname || '/';

  return (
    <Container sx={{ mt: 4 }}>
      {account === '0' || error ? (
        <Typography>{error}</Typography>
      ) : !registered ? (
        <Register />
      ) : (
        <Navigate to={from} replace />
      )}
    </Container>
  );
};
