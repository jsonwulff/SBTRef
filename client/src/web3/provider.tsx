import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

// Typescript infering example: https://www.turfemon.com/infer-types-from-ethereum-json-abi

const web3 = new Web3('http://localhost:8545');
export const eth = web3.eth;

const contractAddress = '0x9D14bcF1fD971E178f5c8b0e7Ff0BbF6C44e37Ed';
export const getContractInstance = (artifact: AbiItem | AbiItem[]) => {
  return new eth.Contract(artifact, contractAddress);
};
