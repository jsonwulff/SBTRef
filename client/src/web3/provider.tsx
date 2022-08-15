import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

// Typescript infering example: https://www.turfemon.com/infer-types-from-ethereum-json-abi

const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
export const eth = web3.eth;

const contractAddress = '0x9B33B43778b561C36a310f707cB343C7736208FD';
export const getContractInstance = (artifact: AbiItem | AbiItem[]) => {
  return new eth.Contract(artifact, contractAddress);
};
