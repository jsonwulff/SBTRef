import { toWei } from 'web3-utils';
import { Card, CardFromContract } from '../../redux/cardsSlice';
import {
  Trade,
  TradeFromContract,
  TradeOffer,
  TradeOfferedEvent,
} from '../../redux/tradeSlice';
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
    .then((result: CardFromContract) => {
      const { 0: a, 1: b, 2: c, 3: d, 4: e, 5: f, 6: g, ...object } = result;
      return object;
    });
};

export const getCardsDetails = (ids: string[]): Promise<Card[]> => {
  return Promise.all(ids.map((id) => getCardDetails(id)));
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

export const makeTradeOffer = (
  to: string,
  from: string,
  offer: string[],
  want: string[]
) => {
  return tokContract.methods.makeTradeOffer(to, offer, want).send({ from });
};

export const getTradeOffers = (filter: {}): Promise<TradeOffer[]> => {
  return tokContract
    .getPastEvents('TradeOffered', {
      filter,
      fromBlock: 0,
      toBlock: 'latest',
    })
    .then((events) => {
      return events.map((event) => {
        const {
          0: a,
          1: b,
          2: c,
          ...offer
        } = event.returnValues as TradeOfferedEvent;
        return offer;
      });
    });
};

export const getTradeDetails = (id: string): Promise<Trade> => {
  return tokContract.methods
    .getTrade(id)
    .call()
    .then((result: TradeFromContract) => {
      const { 0: a, 1: b, 2: c, 3: d, 4: e, 5: f, 6: g, ...object } = result;
      return object;
    });
};

export const acceptTrade = (tradId: string, account: string) => {
  return tokContract.methods.acceptTrade(tradId).send({ from: account });
};
export const declineTrade = (tradId: string, account: string) => {
  return tokContract.methods.declineTrade(tradId).send({ from: account });
};
export const closeTrade = (tradId: string, account: string) => {
  return tokContract.methods.closeTrade(tradId).send({ from: account });
};
