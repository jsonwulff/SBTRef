import { Alert, Snackbar } from '@mui/material';
import { clearPopUpMessage } from '../redux/appSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';

export const GlobalSnackBar = () => {
  const { popUpMessage, open } = useAppSelector((state) => ({
    open: state.app.popUpMessage !== null,
    popUpMessage: state.app.popUpMessage,
  }));
  const dispatch = useAppDispatch();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(clearPopUpMessage());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={popUpMessage?.type}>
        {popUpMessage?.message}
      </Alert>
    </Snackbar>
  );
};
