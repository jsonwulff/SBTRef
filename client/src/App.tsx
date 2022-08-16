import { Button, Grid, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useState } from 'react';
import { useAccount } from './web3/hooks/useAccount';
import { useOwnable } from './web3/hooks/useOwnable';

// const helloWorldContract = getContractInstance(HelloWorld.abi as AbiItem[]);

export const App = () => {
  const [name, setName] = useState();
  useAccount();
  const [getOwner] = useOwnable();

  const hancleOnClick = () => {
    // getOwner(account);
    // if (account !== '') {
    //   cardContract.methods
    //     .createRandomCard('julian')
    //     .send({ from: account })
    //     .on('receipt', function (receipt: any) {
    //       console.log('card created');
    //     })
    //     .on('error', function (error: any, receipt: any) {
    //       console.log('after handle revert:', receipt);
    //       const message = error.message;
    //       const slicedMessage = message.slice(49, error.message.length - 1);
    //       const errorMessageInJson = JSON.parse(slicedMessage);
    //       console.log(errorMessageInJson.value.data.message);
    //     });
    // } else {
    //   console.log('no account connected');
    // }
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
