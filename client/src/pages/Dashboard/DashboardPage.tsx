import { Container, Divider, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { setTrades, TradeWithCardDetails } from '../../redux/tradeSlice';
import {
  getCardsDetails,
  getTradeDetails,
  getTradeOffers,
} from '../../web3/interfaces/TokenContract';
import { RecentTrader } from './RecentTrades';

export const DashboardPage = () => {
  const account = useAppSelector((state) => state.app.account);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchData = async () => {
      const tradeOffers = [
        getTradeOffers({ sender: account }),
        getTradeOffers({ reciever: account }),
      ];
      const [offeredTradeOffers, recievedTradeOffers] = await Promise.all(
        tradeOffers
      );
      const allTradeOffers = [...offeredTradeOffers, ...recievedTradeOffers];
      const traderOffersWithDetails = await Promise.all(
        allTradeOffers.map((to) => getTradeDetails(to.tradeId))
      );
      const tradeWithCardDetails: TradeWithCardDetails[] = await Promise.all(
        traderOffersWithDetails.map(async (to) => {
          const wantsDetails = await getCardsDetails(to.wants);
          const offersDetails = await getCardsDetails(to.offers);
          return { ...to, wants: wantsDetails, offers: offersDetails };
        })
      );
      dispatch(setTrades(tradeWithCardDetails));
    };

    fetchData().catch(console.error);
  }, [account, dispatch]);

  return (
    <Container sx={{ pb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Dashboard
      </Typography>
      <Divider />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item sm={12} md={9}>
          <RecentTrader />
        </Grid>
      </Grid>
    </Container>
  );
};
