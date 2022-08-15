import { Container } from '@mui/system';
import { useEffect } from 'react';
import HelloWorld from "./web3/artifacts/HelloWorld.json"
import { eth } from './web3/provider';


export const App = () => {
  // const contractAddress = "0xC0FB74a1C43a4Fd02167B93c9E54fF62BAedDE7E"
  // const contract = Web3.
  console.log(eth)
  useEffect(() => {
      eth.getAccounts().then((accounts) => console.log(accounts)); 
  }, [])

  console.log(HelloWorld)

  

  return (
    <Container>Test</Container>
  );
}
