import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import TCGRegistry from './artifacts/TCGReg.json';
import TCGToken from './artifacts/TCGTok.json';

// Typescript infering example: https://www.turfemon.com/infer-types-from-ethereum-json-abi

const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
export const eth = web3.eth;

const getContractInstance = (
  artifact: AbiItem | AbiItem[],
  address: string
) => {
  return new eth.Contract(artifact, address);
};

export const tokContract = getContractInstance(
  TCGToken.abi as AbiItem[],
  process.env.REACT_APP_TOKEN_ADDRESS as string
);
export const regContract = getContractInstance(
  TCGRegistry.abi as AbiItem[],
  process.env.REACT_APP_REGISTRY_ADDRESS as string
);
