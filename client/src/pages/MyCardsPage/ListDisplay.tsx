import {
  Box,
  Card as MuiCard,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useState } from 'react';
import { namesMap } from '../../constants/cardMappings';
import { Card } from '../../redux/cardsSlice';
import { Order } from '../../utils';
import { MiniCard } from '../TradeCardsPage/OfferPage/MiniCard';

interface ListDisplayProps {
  cards: Card[];
  sortBy: keyof Card;
  order: Order;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Card
  ) => void;
}

export const ListDisplay = (props: ListDisplayProps) => {
  const { cards, sortBy, order, onRequestSort } = props;
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);

  const createSortHandler =
    (property: keyof Card) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target.value);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cards.length) : 0;

  return (
    <MuiCard>
      <Table size={dense ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
              Card
            </TableCell>
            {headCells.map((cell) => (
              <TableCell
                key={cell.id}
                align={cell.numeric ? 'right' : 'left'}
                sortDirection={sortBy === cell.id ? order : false}
                sx={{ fontWeight: 700, textTransform: 'uppercase' }}
              >
                <TableSortLabel
                  active={sortBy === cell.id}
                  direction={sortBy === cell.id ? order : 'asc'}
                  onClick={createSortHandler(cell.id)}
                >
                  {cell.label}
                  {sortBy === cell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc'
                        ? 'sorted descending'
                        : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {cards
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((card) => (
              <TableRow key={card.id}>
                <TableCell>
                  <MiniCard card={card} size={30} shownInOffer={true} />
                </TableCell>
                <TableCell align="right">{card.id}</TableCell>
                <TableCell>
                  {namesMap[card.cardType] + ` (#${card.cardType})`}
                </TableCell>
                <TableCell align="right">{card.rarity}</TableCell>
                <TableCell align="right">{card.str}</TableCell>
                <TableCell align="right">{card.def}</TableCell>
                <TableCell align="right">{card.hlt}</TableCell>
                <TableCell align="right">{card.traded}</TableCell>
              </TableRow>
            ))}
          {emptyRows > 0 && (
            <TableRow
              style={{
                height: (dense ? 48 : 68) * emptyRows,
              }}
            >
              <TableCell colSpan={8} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense"
          sx={{
            ml: 1,
          }}
        />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={cards.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ display: 'inline-block' }}
        />
      </Box>
    </MuiCard>
  );
};

interface HeadCell {
  id: keyof Card;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: 'id', label: 'ID', numeric: true },
  { id: 'cardType', label: 'Name', numeric: false },
  { id: 'rarity', label: 'Rarity', numeric: true },
  { id: 'str', label: 'Strength', numeric: true },
  { id: 'def', label: 'Defense', numeric: true },
  { id: 'hlt', label: 'Health', numeric: true },
  { id: 'traded', label: '# Traded', numeric: true },
];
