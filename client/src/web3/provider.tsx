import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import CardFactory from './artifacts/CardFactory.json';

// Typescript infering example: https://www.turfemon.com/infer-types-from-ethereum-json-abi

const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
export const eth = web3.eth;

export const getContractInstance = (artifact: AbiItem | AbiItem[]) => {
  return new eth.Contract(artifact, process.env.REACT_APP_CONTRACT_ADDRESS);
};

export const cardContract = getContractInstance(CardFactory.abi as AbiItem[]);
