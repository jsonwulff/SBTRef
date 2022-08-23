import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { useAppSelector } from '../../redux/store';
import { accountToShort } from '../../utils';
import {
  acceptTrade,
  closeTrade,
  declineTrade,
} from '../../web3/interfaces/TokenContract';
import { MiniCard } from '../TradeCardsPage/OfferPage/MiniCard';

export const RecentTrader = () => {
  const { trades, account } = useAppSelector((state) => ({
    trades: state.trade.trades,
    account: state.app.account,
  }));

  const handleOnAcceptTrade = (tradeId: string) => {
    acceptTrade(tradeId, account)
      .then((receipt: any) => {
        console.log(receipt);
      })
      .catch(console.log);
  };

  const handleOnDeclineTrade = (tradeId: string) => {
    declineTrade(tradeId, account)
      .then((receipt: any) => {
        console.log(receipt);
      })
      .catch(console.log);
  };

  const handleOnCloseTrade = (tradeId: string) => {
    closeTrade(tradeId, account)
      .then((receipt: any) => {
        console.log(receipt);
      })
      .catch(console.log);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ pr: 0 }} />
            <TableCell>Trade with</TableCell>
            <TableCell>You will loss</TableCell>
            <TableCell>You will get</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trades.map((row) => {
            const isSender = account === row.offerer;
            return (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell sx={{ pr: 0 }}>
                  {isSender ? (
                    <Tooltip title="Trade offered by you">
                      <SendRoundedIcon color="disabled" />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Trade received">
                      <InboxRoundedIcon color="disabled" />
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip title={row.offerer}>
                    <span>
                      {isSender
                        ? accountToShort(row.reciever)
                        : accountToShort(row.offerer)}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {isSender
                    ? row.offers.map((card) => (
                        <MiniCard card={card} size={30} shownInOffer={true} />
                      ))
                    : row.wants.map((card) => (
                        <MiniCard card={card} size={30} shownInOffer={true} />
                      ))}
                </TableCell>
                <TableCell>
                  {!isSender
                    ? row.offers.map((card) => (
                        <MiniCard card={card} size={30} shownInOffer={true} />
                      ))
                    : row.wants.map((card) => (
                        <MiniCard card={card} size={30} shownInOffer={true} />
                      ))}
                </TableCell>
                <TableCell>
                  {row.closed ? (
                    'Trade is closed'
                  ) : isSender ? (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleOnCloseTrade(row.id)}
                      startIcon={<CloseRoundedIcon />}
                    >
                      Withdraw offer
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleOnAcceptTrade(row.id)}
                        startIcon={<CheckRoundedIcon />}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleOnDeclineTrade(row.id)}
                        startIcon={<CloseRoundedIcon />}
                        sx={{ ml: 1 }}
                      >
                        Decline
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
