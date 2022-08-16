import { Grid, Typography } from '@mui/material';
import { Container } from '@mui/system';
import AppBar from './components/AppBar';
import { Cards } from './components/Cards/Cards';
import { useStartApp } from './web3/hooks/useStartApp';

// const helloWorldContract = getContractInstance(HelloWorld.abi as AbiItem[]);

export const App = () => {
  useStartApp();

  // const hancleOnClick = () => {
  //   // getOwner(account);
  //   // if (account !== '') {
  //   //   cardContract.methods
  //   //     .createRandomCard('julian')
  //   //     .send({ from: account })
  //   //     .on('receipt', function (receipt: any) {
  //   //       console.log('card created');
  //   //     })
  //   //     .on('error', function (error: any, receipt: any) {
  //   //       console.log('after handle revert:', receipt);
  //   //       const message = error.message;
  //   //       const slicedMessage = message.slice(49, error.message.length - 1);
  //   //       const errorMessageInJson = JSON.parse(slicedMessage);
  //   //       console.log(errorMessageInJson.value.data.message);
  //   //     });
  //   // } else {
  //   //   console.log('no account connected');
  //   // }
  // };

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
    <>
      <AppBar />
      <Container sx={{ mt: 4 }}>
        <Grid container direction="row">
          <Grid item sm={6} md={6}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              All cards:
            </Typography>
            <Cards sx={{ mt: 2 }} />
          </Grid>
          <Grid item sm={6} md={6}></Grid>
        </Grid>
      </Container>
    </>
  );
};
