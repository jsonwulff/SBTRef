// import BoltIcon from '@mui/icons-material/Bolt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import ShieldIcon from '@mui/icons-material/Shield';
import {
  Box,
  Button,
  Card as MuiCard,
  CardActions,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import Grid, { GridProps } from '@mui/material/Grid';
import avatar from 'animal-avatar-generator';
import {
  avatarBgColors,
  avatarColors,
  namesMap,
  rarityToColor,
  rarityToString,
} from '../../constants/cardMappings';
import { Card } from '../../redux/cardsSlice';

interface CardDisplayProps extends GridProps {
  card: Card;
}

export const CardDisplay = ({ card, ...rest }: CardDisplayProps) => {
  const image = avatar(namesMap[card.cardType], {
    blackout: false,
    size: 220,
    backgroundColors: ['#fff0'],
    avatarColors: avatarColors,
  });

  return (
    <Grid item sm={4} md={4} lg={3} {...rest}>
      <MuiCard
        elevation={3}
        sx={{
          // p: 1,
          transition: 'all .2s ease-in-out',
          '&:hover': { transform: 'scale(1.05)' },
        }}
      >
        <CardContent sx={{ px: 1, pt: 1, pb: 0 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 0.5,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              #{card.cardType} {namesMap[card.cardType]}
            </Typography>
            <Chip
              size="small"
              label={rarityToString[card.rarity]}
              sx={{
                backgroundColor: rarityToColor[card.rarity],
                color: '#fff',
              }}
            />
          </Box>
          <Box
            dangerouslySetInnerHTML={{ __html: image }}
            sx={{
              textAlign: 'center',
              background: avatarBgColors[card.rarity],
              borderRadius: '10px',
            }}
          />
          <TableContainer>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <OfflineBoltIcon
                        color="warning"
                        sx={{ fontSize: 16, mr: 0.5 }}
                      />
                      Strength:
                    </Box>
                  </TableCell>
                  <TableCell align="right">{card.str}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ShieldIcon color="info" sx={{ fontSize: 16, mr: 0.5 }} />
                      Defense:
                    </Box>
                  </TableCell>
                  <TableCell align="right">{card.def}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FavoriteIcon
                        color="error"
                        sx={{ fontSize: 16, mr: 0.5 }}
                      />
                      Health:
                    </Box>
                  </TableCell>
                  <TableCell align="right">{card.hlt}</TableCell>
                </TableRow>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={{ fontWeight: 700 }}>Total:</TableCell>
                  <TableCell align="right">
                    {Number(card.hlt) + Number(card.str) + Number(card.def)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
        <CardActions
          sx={{ justifyContent: 'space-between', px: 1, pt: 0, pb: 1 }}
        >
          <Button size="small">Trade</Button>
          <Button size="small">Combine</Button>
        </CardActions>
      </MuiCard>
    </Grid>
  );
};
