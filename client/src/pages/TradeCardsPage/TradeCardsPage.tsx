import {
  Container,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { setPlayers } from '../../redux/playersSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { getAllPlayerInfo } from '../../web3/interfaces/PlayerRegistryContract';

export const TradeCardsPage = () => {
  const { account, players } = useAppSelector((state) => ({
    account: state.app.account,
    players: state.players.players,
  }));
  const dispatch = useAppDispatch();

  useEffect(() => {
    getAllPlayerInfo().then((result) => {
      dispatch(setPlayers(result));
    });
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Trade Cards
      </Typography>
      <Divider />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item sm={12} md={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Player address</TableCell>
                  <TableCell align="right">Level</TableCell>
                  <TableCell align="right">Reputation</TableCell>
                  <TableCell align="right">Trades</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {players.map((player) => (
                  <TableRow
                    key={player.address}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {player.address}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {player.playerLevel}
                    </TableCell>
                    <TableCell align="right">{player.reputation}</TableCell>
                    <TableCell align="right">{player.trades}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};
