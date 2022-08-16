import { cardContract } from '../provider';

export const useOwnable = () => {
  const getOwner = async (account: string) => {
    const owner = await cardContract.methods.owner().call({ from: account });
    return owner;
  };

  return [getOwner];
};
