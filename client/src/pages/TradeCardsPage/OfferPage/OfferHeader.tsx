import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import { Avatar, Box, Grid, Paper, Typography } from '@mui/material';
import { PlayerInfo } from '../../../redux/playersSlice';

interface OfferHeaderProps extends PlayerInfo {}

export const OfferHeader = (props: OfferHeaderProps) => {
  return (
    <Box component={Paper} sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        This trade:{' '}
        <Box component="span" sx={{ fontWeight: 'normal' }}>
          You are trading with {props.nickname}
        </Box>
      </Typography>
      <Grid container>
        <Grid item sm={6} md={4}>
          <Box sx={{ display: 'flex', mt: 1, alignItems: 'center' }}>
            <Avatar
              sx={{
                mr: 1.5,
                bgcolor: 'success.main',
                height: 30,
                width: 30,
              }}
            >
              <StarRateRoundedIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography
              variant="body2"
              sx={{ fontWeight: 'normal', lineHeight: 1.1 }}
            >
              has a player level of {props.playerLevel}
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={6} md={4}>
          <Box sx={{ display: 'flex', mt: 1, alignItems: 'center' }}>
            <Avatar
              sx={{
                mr: 1.5,
                bgcolor: 'error.main',
                height: 30,
                width: 30,
              }}
            >
              <FavoriteRoundedIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography
              variant="body2"
              sx={{ fontWeight: 'normal', lineHeight: 1.1 }}
            >
              has a reputation of {props.reputation}
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={6} md={4}>
          <Box sx={{ display: 'flex', mt: 1, alignItems: 'center' }}>
            <Avatar
              sx={{
                mr: 1.5,
                bgcolor: 'info.main',
                height: 30,
                width: 30,
              }}
            >
              <SwapHorizRoundedIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography
              variant="body2"
              sx={{ fontWeight: 'normal', lineHeight: 1.1 }}
            >
              has made {props.trades} trades
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
