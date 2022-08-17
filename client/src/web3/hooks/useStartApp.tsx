import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAccount, setError, setIsRegistered } from '../../redux/appSlice';
import { RootState } from '../../redux/store';
import { isRegistered } from '../interfaces/PlayerRegistryContract';
import { eth } from '../provider';

export const useStartApp = () => {
  const account = useSelector((state: RootState) => state.app.account);
  const dispatch = useDispatch();

  useEffect(() => {
    eth
      .requestAccounts()
      .then((result) => {
        // if(result[0])
        dispatch(setAccount(result[0]));
      })
      .catch((error) => {
        dispatch(
          setError("Couldn't find any account please connect with MetaMask")
        );
      });
  }, [dispatch]);

  const handleAccountsChanged = (accounts: any) => {
    const currentAccount = accounts as string[];
    if (currentAccount.length === 0) {
      dispatch(setError('Please connect to MetaMask'));
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
