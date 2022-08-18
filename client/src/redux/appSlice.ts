import { AlertColor } from '@mui/material';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface PopUpMessage {
  message: string;
  type: AlertColor;
}

export interface AppState {
  account: string;
  registered: boolean;
  popUpMessage: PopUpMessage | null;
}

const initialState: AppState = {
  account: '0',
  registered: false,
  popUpMessage: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<string>) => {
      state.account = action.payload;
    },
    setIsRegistered: (state, action: PayloadAction<boolean>) => {
      state.registered = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.popUpMessage = { message: action.payload, type: 'error' };
    },
    setSuccess: (state, action: PayloadAction<string>) => {
      state.popUpMessage = { message: action.payload, type: 'success' };
    },
    clearPopUpMessage: (state) => {
      state.popUpMessage = null;
    },
  },
});

export const {
  setAccount,
  setError,
  setSuccess,
  clearPopUpMessage,
  setIsRegistered,
} = appSlice.actions;

export default appSlice.reducer;
