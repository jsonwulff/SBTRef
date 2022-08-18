import { toWei } from 'web3-utils';
import { Card } from '../../redux/cardsSlice';
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

export const getCardDetails = (id: string): Promise<Card> => {
  return tokContract.methods
    .stats(id)
    .call()
    .then((result: Card) => {
      const { ...object } = result;
      return object;
    });
};

export const getCardsByOwner = (owner: string): Promise<string[]> => {
  return tokContract.methods.getCardsByOwner(owner).call({ from: owner });
};

export const getCardsWithStatsByOwner = (owner: string) => {
  return getCardsByOwner(owner).then((ids) => {
    const detailPromises = ids.map((id) => getCardDetails(id));
    return Promise.all(detailPromises);
  });
};

export const getPackCost = (from: string): Promise<string> => {
  return tokContract.methods.getPackCost().call({ from });
};
