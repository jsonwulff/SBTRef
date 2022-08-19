import { Box, Grid } from '@mui/material';
import { useMemo } from 'react';
import { Card } from '../../../redux/cardsSlice';
import { MiniCard } from './MiniCard';

interface InventoryPanelProps {
  cards: Card[];
  index: number;
  value: number;
}

export const InventoryPanel = (props: InventoryPanelProps) => {
  const { value, index, cards } = props;
  console.log(cards);

  const cardsToDisplay = useMemo(() => {
    return cards.map((card) => (
      <MiniCard key={card.id} card={card} size={50} sm={2} />
    ));
  }, [cards]);

  return (
    <Box hidden={value !== index} sx={{ p: 1 }}>
      {value === index && (
        <Grid container spacing={1}>
          {cardsToDisplay}
        </Grid>
      )}
    </Box>
  );
};
