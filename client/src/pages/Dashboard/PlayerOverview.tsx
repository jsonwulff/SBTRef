import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import {
  Rarity,
  rarityToColor,
  rarityToString,
} from '../../constants/cardMappings';
import { setMyCards } from '../../redux/cardsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { accountToShort } from '../../utils';
import { getCardsWithStatsByOwner } from '../../web3/interfaces/TokenContract';

interface CardCount {
  '1': number;
  '2': number;
  '3': number;
}
const tabCount: CardCount = { '1': 0, '2': 0, '3': 0 };

export const PlayerOverview = () => {
  const { playerName, playerInfo, account, myCards } = useAppSelector(
    (state) => ({
      playerName: state.app.playerName,
      playerInfo: state.app.playerInfo,
      account: state.app.account,
      myCards: state.cards.myCards,
    })
  );
  const [numCards, setNumCards] = useState(tabCount);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setLoading(true);
    getCardsWithStatsByOwner(account)
      .then((result) => {
        dispatch(setMyCards(result));
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [account, dispatch]);

  useEffect(() => {
    setNumCards(
      myCards.reduce(
        (total: CardCount, currentValue) => ({
          ...total,
          [currentValue.rarity]:
            Number(total[currentValue.rarity as Rarity]) + 1,
        }),
        tabCount
      )
    );
  }, [myCards]);

  const series = Object.values(numCards);
  const labels = Object.keys(numCards).map((key) => rarityToString[key]);

  return (
    <Card>
      <CardHeader
        title="Your profile"
        titleTypographyProps={{ variant: 'h6', sx: { fontWeight: 700 } }}
      />
      <Divider />
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Nickname</TableCell>
            <TableCell align="right">{playerName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Address</TableCell>
            <TableCell align="right">
              {accountToShort(playerInfo?.address || "Couldn't get name ")}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Level</TableCell>
            <TableCell align="right">{playerInfo?.playerLevel}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Reputation</TableCell>
            <TableCell align="right">{playerInfo?.reputation}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Number of trades</TableCell>
            <TableCell align="right">{playerInfo?.trades}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700 }}>
          Card statistics:
        </Typography>
        <Chart
          options={{
            labels,
            colors: Object.values(rarityToColor),
            legend: { show: false },
            stroke: { show: false },
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    show: true,
                    total: { show: true, fontSize: '20', showAlways: true },
                  },
                },
              },
            },
            dataLabels: { enabled: false },
          }}
          series={series}
          type="donut"
        />
      </Box>
    </Card>
  );
};
