import {
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { setPlayers } from '../../redux/playersSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { accountToShort } from '../../utils';
import { getAllPlayerInfo } from '../../web3/interfaces/PlayerRegistryContract';

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
  }, []);

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
                  <TableCell align="right">Level</TableCell>
                  <TableCell align="right">Reputation</TableCell>
                  <TableCell align="right">Trades</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from(Array(10).keys()).map((i) => (
                      <TableRow
                        key={i}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <Skeleton />
                        </TableCell>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton />
                        </TableCell>
                      </TableRow>
                    ))
                  : players.map((player) => (
                      <TableRow
                        key={player.address}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {player.nickname}
                          {player.address === account && (
                            <Chip
                              size="small"
                              label="You"
                              color="success"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip arrow title={player.address}>
                            <span>{accountToShort(player.address)}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">
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
