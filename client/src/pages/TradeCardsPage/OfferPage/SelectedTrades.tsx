import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import {
  alpha,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { useAppSelector } from '../../../redux/store';
import { MiniCard } from './MiniCard';
export const SelectedTrades = () => {
  const { nickname, offer, wants, myCards, tradersCards } = useAppSelector(
    (state) => ({
      nickname: state.trade.trader?.nickname,
      offer: state.trade.offer,
      wants: state.trade.wants,
      myCards: state.cards.myCards,
      tradersCards: state.trade.traderCards,
    })
  );

  const offerCards = myCards.filter((card) => offer.includes(card.id));
  const emptyOffers = 8 - offerCards.length;
  const wantCards = tradersCards.filter((card) => wants.includes(card.id));

  return (
    <Box component={Paper} sx={{ width: '100%', px: 2, py: 1.5 }}>
      <Box sx={{ pb: 2 }}>
        <Typography variant="button" color="primary.main">
          Your cards:
        </Typography>
        <Typography variant="body2">
          These are the cards you will loss in the trade
        </Typography>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {offerCards.map((card) => (
            <Grid item sm={3}>
              <MiniCard key={card.id} card={card} size={100} owner="yours" />
            </Grid>
          ))}
          {Array.from(Array(emptyOffers).keys()).map((i) => (
            <Grid item sm={3} key={i}>
              <Box
                sx={(theme) => ({
                  height: 100,
                  width: '100%',
                  backgroundColor: 'grey.300',
                  borderRadius: '5px',
                  border: `3px solid ${alpha(theme.palette.grey[400], 0.4)}`,
                })}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Divider>
        <SwapVertRoundedIcon
          sx={(theme) => ({ fontSize: 40, color: theme.palette.grey[500] })}
        />
      </Divider>
      <Box sx={{ pb: 3 }}>
        <Typography variant="button" color="primary.main">
          {nickname}'s cards:
        </Typography>
        <Typography variant="body2">
          These are the cards you will loss in the trade
        </Typography>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {wantCards.map((card) => (
            <Grid item sm={3}>
              <MiniCard key={card.id} card={card} size={100} owner="theirs" />
            </Grid>
          ))}
          {Array.from(Array(8).keys()).map((i) => (
            <Grid item sm={3} key={i}>
              <Box
                sx={(theme) => ({
                  height: 100,
                  width: '100%',
                  backgroundColor: 'grey.300',
                  borderRadius: '5px',
                  border: `3px solid ${alpha(theme.palette.grey[400], 0.4)}`,
                })}
              />
            </Grid>
          ))}
        </Grid>
        <Typography variant="body2" sx={{ pt: 1.5 }}>
          {nickname} will be notified of your trade offer
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ pt: 3, pb: 2, textAlign: 'center' }}>
        <Button size="large" color="success" variant="contained">
          Make offer
        </Button>
      </Box>
    </Box>
  );
};
