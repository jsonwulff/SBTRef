import { Container, Grid } from '@mui/material';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loading } from '../../../components/Loading';
import { setMyCards } from '../../../redux/cardsSlice';
import { PlayerInfo } from '../../../redux/playersSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { setTrader, setTraderCards } from '../../../redux/tradeSlice';
import {
  getPlayerInfo,
  getPlayerName,
} from '../../../web3/interfaces/PlayerRegistryContract';
import { getCardsWithStatsByOwner } from '../../../web3/interfaces/TokenContract';
import { Inventory } from './Inventory';
import { OfferHeader } from './OfferHeader';
import { SelectedTrades } from './SelectedTrades';

export const OfferPage = () => {
  const { account, trader } = useAppSelector((state) => ({
    account: state.app.account,
    trader: state.trade.trader,
  }));

  const { address } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (address) {
      const traderInfo = getPlayerInfo(address);
      const traderName = getPlayerName(address);
      const traderCards = getCardsWithStatsByOwner(address);
      const myCards = getCardsWithStatsByOwner(account);
      const promises = [traderInfo, traderName, traderCards, myCards];
      Promise.all(promises).then(([info, name, cards, myCards]) => {
        const player = { nickname: name, ...info } as PlayerInfo;
        dispatch(setTrader(player));
        dispatch(setTraderCards(cards));
        dispatch(setMyCards(myCards));
      });
    }
  }, [address, account, dispatch]);

  if (!trader) {
    return <Loading />;
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <OfferHeader {...trader} />
        </Grid>
        <Grid item sm={6} md={6}>
          <Inventory />
        </Grid>
        <Grid item sm={6} md={6}>
          <SelectedTrades />
        </Grid>
      </Grid>
    </Container>
  );
};
