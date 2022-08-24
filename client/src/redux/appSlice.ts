import { AlertColor } from '@mui/material';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { PlayerStructWithAddress } from './playersSlice';

export interface PopUpMessage {
  message: string;
  type: AlertColor;
}

export interface AppState {
  account: string;
  registered: boolean;
  playerInfo: PlayerStructWithAddress | null;
  playerName: string;
  popUpMessage: PopUpMessage | null;
}

const initialState: AppState = {
  account: '0',
  registered: false,
  popUpMessage: null,
  playerInfo: null,
  playerName: '',
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
    setPlayerInfo: (state, action: PayloadAction<PlayerStructWithAddress>) => {
      state.playerInfo = action.payload;
    },
    setPlayerName: (state, action: PayloadAction<string>) => {
      state.playerName = action.payload;
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
  setPlayerInfo,
  setPlayerName,
  setError,
  setSuccess,
  clearPopUpMessage,
  setIsRegistered,
} = appSlice.actions;

export default appSlice.reducer;
