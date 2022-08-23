import { alpha, Box, Tab as MuiTab } from '@mui/material';
import { rarityToColor, rarityToString } from '../../constants/cardMappings';

interface TabProps {
  rarity: 0 | 1 | 2 | 3;
  numCards: number;
}

export const Tab = ({ rarity, numCards }: TabProps) => {
  return (
    <MuiTab
      sx={{
        textTransform: 'none',
        minWidth: 'unset',
        fontWeight: 700,
        p: 0,
        mr: 5,
        flexDirection: 'row',
      }}
      label={
        <>
          <Box
            component="span"
            sx={{
              mr: 1,
              px: 1,
              backgroundColor:
                rarity === 0 ? '#fff' : alpha(rarityToColor[rarity], 0.2),
              color: rarity === 0 ? '#000' : rarityToColor[rarity],
              lineHeight: 1.55,
              borderRadius: '6px',
            }}
          >
            {numCards}
          </Box>
          {rarity === 0 ? 'All' : rarityToString[rarity]}
        </>
      }
    />
  );
};
