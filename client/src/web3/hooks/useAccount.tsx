import { useEffect, useState } from 'react';
import { eth } from '../provider';

export const useAccount = () => {
  const [account, setAccount] = useState<string>('');

  useEffect(() => {
    eth.requestAccounts().then((result) => {
      setAccount(result[0]);
    });
  }, []);

  const handleAccountsChanged = (accounts: any) => {
    const currentAccount = accounts as string[];
    if (currentAccount.length === 0) {
      console.log('Please connect to MetaMask');
    } else if (currentAccount[0] !== account) {
      setAccount(currentAccount[0]);
    }
  };

  window.ethereum.on('accountsChanged', handleAccountsChanged);

  return [account];
};
