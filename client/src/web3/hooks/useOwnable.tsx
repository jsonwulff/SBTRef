import { tokContract } from '../provider';

export const useOwnable = () => {
  const getOwner = async (account: string) => {
    const owner = await tokContract.methods.owner().call({ from: account });
    return owner;
  };

  return [getOwner];
};
