import { Button, Grid, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useState } from 'react';
import { AbiItem } from 'web3-utils';
import CardFactory from './web3/artifacts/CardFactory.json';
import { useAccount } from './web3/hooks/useAccount';
import { getContractInstance } from './web3/provider';
// import Web3 from 'web3';

// const helloWorldContract = getContractInstance(HelloWorld.abi as AbiItem[]);

export const App = () => {
  const [name, setName] = useState();
  const [account] = useAccount();

  const cardContract = getContractInstance(CardFactory.abi as AbiItem[]);

  const hancleOnClick = () => {
    if (account !== '') {
      cardContract.methods
        .createRandomCard('julian')
        .send({ from: account })
        .on('receipt', function (receipt: any) {
          console.log('card created');
        })
        .on('error', function (error: any) {
          console.log('error:', error);
        });
    } else {
      console.log('no account conneted');
    }
  };

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setName(event.target.value);
  // };

  // const handleOnClick = async () => {
  //   const adresseses = await eth.getAccounts();
  //   helloWorldContract.methods
  //     .changeMyName(name)
  //     .send({ from: adresseses[0] })
  //     .then((receipt: any) => {
  //       console.log(receipt);
  //     });
  // };

  return (
    <Container>
      <Grid container direction="column">
        <Grid item>
          <Typography>My name is {name}</Typography>
        </Grid>
        {/* <Grid item>
          <TextField value={name} onChange={handleChange} />
        </Grid> */}
        <Grid item>
          <Button onClick={hancleOnClick}>Create card</Button>
        </Grid>
      </Grid>
    </Container>
  );
};
