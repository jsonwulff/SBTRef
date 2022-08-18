import { Container } from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import { LocationWithState } from '../../routes/RequireRegistered';
import { Connect } from './Connect';
import { Register } from './Register';

export const FrontPage = () => {
  const { account, registered } = useAppSelector((state) => state.app);
  const location = useLocation() as LocationWithState;
  const from = location.state?.from?.pathname || '/';

  return (
    <Container sx={{ height: '100%' }}>
      {account === '0' ? (
        <Connect />
      ) : !registered ? (
        <Register />
      ) : (
        <Navigate to={from} replace />
      )}
    </Container>
  );
};
