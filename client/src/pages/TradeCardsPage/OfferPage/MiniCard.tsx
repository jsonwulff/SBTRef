import { Box, Popover } from '@mui/material';
import Grid, { GridProps } from '@mui/material/Grid';
import avatar from 'animal-avatar-generator';
import { useMemo, useState } from 'react';
import {
  avatarBgColors,
  avatarColors,
  namesMap,
} from '../../../constants/cardMappings';
import { Card } from '../../../redux/cardsSlice';
import { CardDisplay } from '../../MyCardsPage/CardDisplay';

interface MiniCardProps extends GridProps {
  card: Card;
  size: number;
}

export const MiniCard = ({ card, size, ...other }: MiniCardProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const image = useMemo(
    () =>
      avatar(namesMap[card.cardType], {
        blackout: false,
        size,
        backgroundColors: ['#fff0'],
        avatarColors: avatarColors,
      }),
    [card, size]
  );

  const cardDisplay = useMemo(
    () => <CardDisplay card={card} shownOnTrade />,
    [card]
  );

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <Grid item {...other}>
      <Box
        dangerouslySetInnerHTML={{ __html: image }}
        sx={{
          textAlign: 'center',
          background: avatarBgColors[card.rarity],
          borderRadius: '5px',
        }}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        {cardDisplay}
      </Popover>
    </Grid>
  );
};
