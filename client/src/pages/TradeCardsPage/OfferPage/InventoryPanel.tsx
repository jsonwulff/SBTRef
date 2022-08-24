import { Box, Grid } from '@mui/material';
import { useMemo } from 'react';
import { Card } from '../../../redux/cardsSlice';
import { MiniCard } from './MiniCard';

interface InventoryPanelProps {
  cards: Card[];
  index: number;
  value: number;
  owner: 'yours' | 'theirs';
}

export const InventoryPanel = (props: InventoryPanelProps) => {
  const { value, index, cards, owner } = props;

  const cardsToDisplay = useMemo(() => {
    return cards.map((card) => (
      <Grid key={card.id} item sm={3} sx={{ position: 'relative' }}>
        <MiniCard card={card} size={100} owner={owner} inInventory={true} />
      </Grid>
    ));
  }, [cards, owner]);

  return (
    <Box
      hidden={value !== index}
      sx={{ p: 1, height: '660px', overflow: 'auto' }}
    >
      {value === index && (
        <Grid container spacing={1}>
          {cardsToDisplay}
        </Grid>
      )}
    </Box>
  );
};
