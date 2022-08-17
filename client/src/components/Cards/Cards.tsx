import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import { useAppSelector } from '../../redux/store';

export const Cards = (props: BoxProps) => {
  const cards = useAppSelector((state) => state.cards.myCards);

  return (
    <Box {...props}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Card/Token ID</TableCell>
              <TableCell>Owner address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cards.map((card) => (
              <TableRow
                key={card.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {card.id}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
