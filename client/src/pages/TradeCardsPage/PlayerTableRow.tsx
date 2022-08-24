import { Button, Chip, TableCell, TableRow, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PlayerInfo } from '../../redux/playersSlice';
import { accountToShort } from '../../utils';

interface PlayerTableRowProps extends PlayerInfo {
  account: string;
}

export const PlayerTableRow = (props: PlayerTableRowProps) => {
  const {
    account,
    nickname,
    address,
    playerLevel,
    reputation,
    trades,
    numCards,
  } = props;
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate(`${address}`);
  };

  return (
    <TableRow
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
      }}
    >
      <TableCell component="th" scope="row">
        {nickname}
        {address === account && (
          <Chip size="small" label="You" color="success" sx={{ ml: 1 }} />
        )}
      </TableCell>
      <TableCell>
        <Tooltip arrow title={address}>
          <span>{accountToShort(address)}</span>
        </Tooltip>
      </TableCell>
      <TableCell align="right">{numCards}</TableCell>
      <TableCell align="right">{playerLevel}</TableCell>
      <TableCell align="right">{reputation}</TableCell>
      <TableCell align="right">{trades}</TableCell>
      <TableCell align="right">
        <Button
          size="small"
          variant="outlined"
          onClick={handleOnClick}
          disabled={account === address}
        >
          Trade
        </Button>
      </TableCell>
    </TableRow>
  );
};
