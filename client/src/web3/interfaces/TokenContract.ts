import { toWei } from 'web3-utils';
import { tokContract } from '../provider';
export type PackSize = 10 | 20 | 50;

export const buyPacks = (fromAccount: string, packSize: PackSize) => {
  if (packSize === 10) {
    return tokContract.methods.buyPackOfTen(fromAccount).send({
      from: fromAccount,
      value: toWei(((packSize / 10) * 0.00264).toString(), 'ether'),
    });
  } else if (packSize === 20) {
    return tokContract.methods.buyPackOfTwenty(fromAccount).send({
      from: fromAccount,
      value: toWei(((packSize / 10) * 0.00264).toString(), 'ether'),
    });
  } else if (packSize === 50) {
    return tokContract.methods.buyPackOfFifty(fromAccount).send({
      from: fromAccount,
      value: toWei(((packSize / 10) * 0.00264).toString(), 'ether'),
    });
  }
};

export const getCardsByOwner = (owner: string) => {
  return tokContract.methods.getCardsByOwner(owner).call({ from: owner });
};
