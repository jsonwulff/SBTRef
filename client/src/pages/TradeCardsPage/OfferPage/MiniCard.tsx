import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { alpha, Box, Popover } from '@mui/material';
import avatar from 'animal-avatar-generator';
import { useMemo, useState } from 'react';
import {
  avatarBgColors,
  avatarColors,
  namesMap,
} from '../../../constants/cardMappings';
import { Card } from '../../../redux/cardsSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { setOffer, setWants } from '../../../redux/tradeSlice';
import { CardDisplay } from '../../MyCardsPage/CardDisplay';

interface MiniCardProps {
  card: Card;
  size: number;
  owner?: 'yours' | 'theirs';
  inInventory?: boolean;
  shownInOffer?: boolean;
}

export const MiniCard = ({
  card,
  size,
  owner,
  shownInOffer = false,
  inInventory = false,
}: MiniCardProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { offer, wants } = useAppSelector((state) => state.trade);
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
        ...(shownInOffer
          ? { width: size, display: 'inline-block', mr: 0.5 }
          : { position: 'relative' }),
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
        onClick={!shownInOffer ? handleOnClick : undefined}
      />
      {inInventory && (offer.includes(card.id) || wants.includes(card.id)) && (
        <Box
          sx={{
            position: 'absolute',
            pointerEvents: 'none',
            top: 0,
            bottom: 0,
            height: '100%',
            width: '100%',
            backgroundColor: alpha('#000', 0.55),
            borderRadius: '5px',
          }}
        >
          <CloseRoundedIcon sx={{ color: '#fff' }} />
        </Box>
      )}
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
