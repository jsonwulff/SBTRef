import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setAccount, setError, setIsRegistered } from '../../redux/appSlice';
import { RootState } from '../../redux/store';
import { isRegistered } from '../interfaces/PlayerRegistryContract';

export const useStartApp = () => {
  const account = useSelector((state: RootState) => state.app.account);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAccountsChanged = (accounts: any) => {
    const currentAccount = accounts as string[];
    if (currentAccount.length === 0) {
      if (location.pathname !== '/') {
        navigate('/');
      }
      dispatch(setError('Please connect to MetaMask'));
      dispatch(setAccount('0'));
    } else if (currentAccount[0] !== account) {
      dispatch(setAccount(currentAccount[0]));
    }
  };

  window.ethereum.on('accountsChanged', handleAccountsChanged);

  useEffect(() => {
    if (account !== '0') {
      isRegistered(account).then((result) => {
        dispatch(setIsRegistered(result));
      });
    }
  }, [account, dispatch]);
};
