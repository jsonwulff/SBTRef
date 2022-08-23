import { Box, Popover } from '@mui/material';
import avatar from 'animal-avatar-generator';
import { useMemo, useState } from 'react';
import {
  avatarBgColors,
  avatarColors,
  namesMap,
} from '../../../constants/cardMappings';
import { Card } from '../../../redux/cardsSlice';
import { useAppDispatch } from '../../../redux/store';
import { setOffer, setWants } from '../../../redux/tradeSlice';
import { CardDisplay } from '../../MyCardsPage/CardDisplay';

interface MiniCardProps {
  card: Card;
  size: number;
  owner?: 'yours' | 'theirs';
  shownInOffer?: boolean;
}

export const MiniCard = ({
  card,
  size,
  owner,
  shownInOffer = false,
}: MiniCardProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const dispatch = useAppDispatch();

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

  const handleOnClick = () => {
    if (owner === 'yours') {
      dispatch(setOffer(card.id));
    } else if (owner === 'theirs') {
      dispatch(setWants(card.id));
    }
  };

  const open = Boolean(anchorEl);
  return (
    <Box
      sx={{
        ...(shownInOffer && { width: size, display: 'inline-block', mr: 0.5 }),
      }}
    >
      <Box
        dangerouslySetInnerHTML={{ __html: image }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: avatarBgColors[card.rarity],
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        onClick={shownInOffer ? handleOnClick : undefined}
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
    </Box>
  );
};
