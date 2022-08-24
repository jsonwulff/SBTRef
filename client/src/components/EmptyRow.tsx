import { Box, Button, TableCell, TableRow, Typography } from '@mui/material';

interface EmptyRowProps {
  title: string;
  subTitle: string;
  buttonText: string;
  buttonOnClick: () => void;
}

export const EmptyRow = (props: EmptyRowProps) => {
  const { title, subTitle, buttonText, buttonOnClick } = props;

  return (
    <TableRow>
      <TableCell colSpan={5}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 2,
          }}
        >
          <img
            alt="Under development"
            src="/noCardsFound.svg"
            style={{
              display: 'inline-block',
              maxWidth: '100%',
              width: 250,
            }}
          />
          <Box sx={{ maxWidth: 575, textAlign: 'center' }}>
            <Typography
              align="center"
              color="textPrimary"
              variant="h5"
              sx={{ fontWeight: 700 }}
            >
              {title}
            </Typography>
            <Typography align="center" color="textPrimary" variant="subtitle1">
              {subTitle}
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              onClick={buttonOnClick}
            >
              {buttonText}
            </Button>
          </Box>
        </Box>
      </TableCell>
    </TableRow>
  );
};
