import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import {
  Button,
  Card as MuiCard,
  CardHeader,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EmptyRow } from '../../components/EmptyRow';
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
  const navigate = useNavigate();

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
    <MuiCard>
      <CardHeader
        title="Recent trades"
        titleTypographyProps={{ variant: 'h6', sx: { fontWeight: 700 } }}
      />
      <Divider />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow
              sx={(theme) => ({ backgroundColor: theme.palette.grey[100] })}
            >
              <TableCell
                colSpan={2}
                sx={{ fontWeight: 700, textTransform: 'uppercase' }}
              >
                Trade with
              </TableCell>
              <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                You will loss
              </TableCell>
              <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                You will get
              </TableCell>
              <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades.length === 0 ? (
              <EmptyRow
                title="You do not have any recent trades."
                subTitle="Go to the trades page to start trading with other users, and if
                your are lucky, improve your cards' stats in the trade."
                buttonText="Start trading cards now"
                buttonOnClick={() => navigate('/app/trade-cards')}
              />
            ) : (
              trades.map((row) => {
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
                    <TableCell sx={{ pl: 0 }}>
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
                            <MiniCard
                              key={card.id}
                              card={card}
                              size={30}
                              shownInOffer={true}
                            />
                          ))
                        : row.wants.map((card) => (
                            <MiniCard
                              key={card.id}
                              card={card}
                              size={30}
                              shownInOffer={true}
                            />
                          ))}
                    </TableCell>
                    <TableCell>
                      {!isSender
                        ? row.offers.map((card) => (
                            <MiniCard
                              key={card.id}
                              card={card}
                              size={30}
                              shownInOffer={true}
                            />
                          ))
                        : row.wants.map((card) => (
                            <MiniCard
                              key={card.id}
                              card={card}
                              size={30}
                              shownInOffer={true}
                            />
                          ))}
                    </TableCell>
                    <TableCell>
                      {row.closed ? (
                        'Trade is closed'
                      ) : isSender ? (
                        <Tooltip arrow title="Withdraw trade">
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleOnCloseTrade(row.id)}
                            startIcon={<CloseRoundedIcon />}
                            sx={{
                              minWidth: 'unset',
                              '& .MuiButton-startIcon': { m: 0 },
                            }}
                          />
                        </Tooltip>
                      ) : (
                        <>
                          <Tooltip arrow title="Accept trade">
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleOnAcceptTrade(row.id)}
                              startIcon={<CheckRoundedIcon />}
                              sx={{
                                minWidth: 'unset',
                                '& .MuiButton-startIcon': { m: 0 },
                              }}
                            />
                          </Tooltip>
                          <Tooltip arrow title="Decline trade">
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleOnDeclineTrade(row.id)}
                              startIcon={<CloseRoundedIcon />}
                              sx={{
                                ml: 1,
                                minWidth: 'unset',
                                '& .MuiButton-startIcon': { m: 0 },
                              }}
                            />
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MuiCard>
  );
};
