import { Skeleton, TableCell, TableRow } from '@mui/material';

interface LoadingTableRowProps {
  numCells: number;
}

export const LoadingTableRow = ({ numCells }: LoadingTableRowProps) => {
  return (
    <TableRow
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
      }}
    >
      {Array.from(Array(numCells).keys()).map((i) => (
        <TableCell key={i}>
          <Skeleton />
        </TableCell>
      ))}
    </TableRow>
  );
};
