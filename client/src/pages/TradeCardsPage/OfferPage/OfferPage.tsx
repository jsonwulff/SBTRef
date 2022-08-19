import { Box, CircularProgress, Container } from '@mui/material';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PlayerInfo } from '../../../redux/playersSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { setTrader, setTraderCards } from '../../../redux/tradeSlice';
import {
  getPlayerInfo,
  getPlayerName,
} from '../../../web3/interfaces/PlayerRegistryContract';
import { getCardsWithStatsByOwner } from '../../../web3/interfaces/TokenContract';
import { OfferHeader } from './OfferHeader';

export const OfferPage = () => {
  const { trader } = useAppSelector((state) => state.trade);

  const { address } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (address) {
      const traderInfo = getPlayerInfo(address);
      const traderName = getPlayerName(address);
      const traderCards = getCardsWithStatsByOwner(address);
      const promises = [traderInfo, traderName, traderCards];
      Promise.all(promises).then(([info, name, cards]) => {
        const player = { nickname: name, ...info } as PlayerInfo;
        dispatch(setTrader(player));
        dispatch(setTraderCards(cards));
      });
    }
  }, [address, dispatch]);

  if (!trader) {
    return (
      <Box
        sx={{
          display: 'flex',
          flex: '1 1',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <OfferHeader {...trader} />
    </Container>
  );
};
