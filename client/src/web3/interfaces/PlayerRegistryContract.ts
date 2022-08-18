import { regContract } from '../provider';

export const register = (fromAccount: string) => {
  return regContract.methods.register().send({ from: fromAccount });
};

export const isRegistered = (account: string): Promise<boolean> => {
  return regContract.methods.getIsRegistered(account).call({ from: account });
};

export const getPlayerInfo = (account: string): Promise<any> => {
  return regContract.methods
    .playerInfo(account)
    .call()
    .then((result: any) => {
      const { ...object } = result;
      object.address = account;
      return object;
    });
};

export const getAllPlayerAddresses = (): Promise<any> => {
  return regContract.getPastEvents('PlayerRegistered', {
    fromBlock: 0,
    toBlock: 'latest',
  });
};

export const getAllPlayerInfo = (): Promise<any> => {
  return getAllPlayerAddresses().then((events) => {
    const playerAddresses = events.map(
      (events: any) => events.returnValues.player
    );
    const playerInfoPromises = playerAddresses.map((address: string) =>
      getPlayerInfo(address)
    );
    return Promise.all(playerInfoPromises);
  });
};
