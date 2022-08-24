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
import { useEffect, useState } from 'react';
import { setPlayers } from '../../redux/playersSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { getAllPlayerInfo } from '../../web3/interfaces/PlayerRegistryContract';
import { LoadingTableRow } from './LoadingTableRow';
import { PlayerTableRow } from './PlayerTableRow';

export const TradeCardsPage = () => {
  const { account, players } = useAppSelector((state) => ({
    account: state.app.account,
    players: state.players.players,
  }));
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setLoading(true);
    getAllPlayerInfo().then((result) => {
      dispatch(setPlayers(result));
      setLoading(false);
    });
  }, [dispatch]);

  return (
    <Container sx={{ pb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Trade Cards
      </Typography>
      <Divider />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item sm={12} md={12}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nickname</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell align="right"># Cards</TableCell>
                  <TableCell align="right">Level</TableCell>
                  <TableCell align="right">Reputation</TableCell>
                  <TableCell align="right">Trades</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from(Array(10).keys()).map((i) => (
                      <LoadingTableRow key={i} numCells={6} />
                    ))
                  : players.map((player) => (
                      <PlayerTableRow
                        key={player.address}
                        account={account}
                        {...player}
                      />
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};
