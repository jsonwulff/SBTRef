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
  return regContract.getPastEvents('UserRegister', {
    fromBlock: 0,
    toBlock: 'latest',
  });
};

export const getAllPlayerInfo = (): Promise<any> => {
  return getAllPlayerAddresses().then((events) => {
    console.log(events);
    const players = events.map((event: any) => ({
      address: event.returnValues.who,
      nickname: event.returnValues.username,
    }));
    console.log(players);
    const playerInfoPromises = players.map(
      (player: { address: string; nickname: string }) =>
        getPlayerInfo(player.address).then((result: any) => ({
          ...result,
          nickname: player.nickname,
        }))
    );
    return Promise.all(playerInfoPromises);
  });
};
