import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAccount } from '../../redux/appSlice';
import { RootState } from '../../redux/store';
import { eth } from '../provider';

export const useAccount = () => {
  const account = useSelector((state: RootState) => state.app.account);
  const dispatch = useDispatch();

  useEffect(() => {
    eth.requestAccounts().then((result) => {
      console.log('from useeffect');
      dispatch(setAccount(result[0]));
    });
  }, []);

  const handleAccountsChanged = (accounts: any) => {
    const currentAccount = accounts as string[];
    if (currentAccount.length === 0) {
      console.log('Please connect to MetaMask');
    } else if (currentAccount[0] !== account) {
      console.log('from listener');
      dispatch(setAccount(currentAccount[0]));
    }
  };

  window.ethereum.on('accountsChanged', handleAccountsChanged);
};
