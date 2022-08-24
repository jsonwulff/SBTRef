import { Box, CircularProgress } from '@mui/material';

export const Loading = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <CircularProgress />
  </Box>
);
