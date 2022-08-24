import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  setAccount,
  setError,
  setIsRegistered,
  setPlayerInfo,
  setPlayerName,
} from '../../redux/appSlice';
import { RootState } from '../../redux/store';
import {
  getPlayerInfo,
  getPlayerName,
  isRegistered,
} from '../interfaces/PlayerRegistryContract';

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
      isRegistered(account).then((isReg) => {
        const playerInfoPromise = getPlayerInfo(account);
        const playerNamePromise = getPlayerName(account);
        Promise.all([playerInfoPromise, playerNamePromise]).then(
          ([playerInfo, playerName]) => {
            dispatch(setIsRegistered(isReg));
            dispatch(setPlayerInfo(playerInfo));
            dispatch(setPlayerName(playerName));
          }
        );
      });
    }
  }, [account, dispatch]);
};
