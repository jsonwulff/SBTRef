import { EventData } from 'web3-eth-contract';
import {
  PlayerStructFromContract,
  PlayerStructWithAddress,
} from '../../redux/playersSlice';
import { regContract } from '../provider';

export const register = (nickname: string, from: string) => {
  return regContract.methods.register(nickname).send({ from });
};

export const isRegistered = (account: string): Promise<boolean> => {
  return regContract.methods.getIsRegistered(account).call({ from: account });
};

export const lookupUsername = (
  username: string,
  from: string
): Promise<any> => {
  return regContract.methods.lookupUsername(username).call({ from });
};

export const getPlayerName = (account: string) => {
  return regContract
    .getPastEvents('UserRegister', {
      filter: { who: account },
      fromBlock: 0,
      toBlock: 'latest',
    })
    .then((events) => events[0].returnValues.username);
};

export const getPlayerInfo = (
  account: string
): Promise<PlayerStructWithAddress> => {
  return regContract.methods
    .playerInfo(account)
    .call()
    .then((result: PlayerStructFromContract) => {
      const { 0: a, 1: b, 2: c, ...object } = result;
      const player: PlayerStructWithAddress = { address: account, ...object };
      return player;
    });
};

export const getAllPlayerAddresses = (): Promise<EventData[]> => {
  return regContract.getPastEvents('UserRegister', {
    fromBlock: 0,
    toBlock: 'latest',
  });
};

export const getAllPlayerInfo = (): Promise<any> => {
  return getAllPlayerAddresses().then((events) => {
    const players = events.map(
      (event: EventData): { address: string; nickname: string } => ({
        address: event.returnValues.who,
        nickname: event.returnValues.username,
      })
    );
    const playerInfoPromises = players.map((player) =>
      getPlayerInfo(player.address).then((result) => ({
        ...result,
        nickname: player.nickname,
      }))
    );
    return Promise.all(playerInfoPromises);
  });
};
