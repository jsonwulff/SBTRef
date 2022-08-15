import { Button, Grid, TextField, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import { AbiItem } from 'web3-utils';
import HelloWorld from './web3/artifacts/HelloWorld.json';
import { eth, getContractInstance } from './web3/provider';

const helloWorldContract = getContractInstance(HelloWorld.abi as AbiItem[]);

export const App = () => {
  const [name, setName] = useState('');

  useEffect(() => {
    helloWorldContract.methods
      .getMyName()
      .call()
      .then((result: string) => {
        setName(result);
      });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleOnClick = async () => {
    const adresseses = await eth.getAccounts();
    helloWorldContract.methods
      .changeMyName(name)
      .send({ from: adresseses[0] })
      .then((receipt: any) => {
        console.log(receipt);
      });
  };

  return (
    <Container>
      <Grid container direction="column">
        <Grid item>
          <Typography>My name is {name}</Typography>
        </Grid>
        <Grid item>
          <TextField value={name} onChange={handleChange} />
        </Grid>
        <Grid item>
          <Button onClick={handleOnClick}>Change name</Button>
        </Grid>
      </Grid>
    </Container>
  );
};
