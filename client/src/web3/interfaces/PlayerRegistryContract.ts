import { regContract } from '../provider';

export const register = (fromAccount: string) => {
  return regContract.methods.register().send({ from: fromAccount });
};

export const isRegistered = (account: string): Promise<boolean> => {
  return regContract.methods.getIsRegistered(account).call({ from: account });
};
