import { LoadingButton } from '@mui/lab';
import { Grid, Paper, Skeleton, Typography } from '@mui/material';
import { PackOfferType } from './CardStorePage';

export const PackOffer = ({ numCards, price, name }: PackOfferType) => {
  return (
    <Grid item sm={4}>
      <Paper sx={{ p: 1 }}>
        <Skeleton animation={false} variant="rectangular" height={200} />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mt: 1 }}>
          {name}
        </Typography>
        <Typography variant="body1">Contains {numCards} cards</Typography>
        <Typography variant="body2" gutterBottom>
          Price: {price} ETH
        </Typography>
        <LoadingButton
          variant="contained"
          color="success"
          fullWidth
          sx={{ mt: 1 }}
        >
          Buy pack
        </LoadingButton>
      </Paper>
    </Grid>
  );
};
