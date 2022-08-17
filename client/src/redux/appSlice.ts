import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface AppState {
  account: string;
  registered: boolean;
  error: string | null;
}

const initialState: AppState = {
  account: '0',
  registered: false,
  error: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<string>) => {
      state.account = action.payload;
      state.error = null;
    },
    setIsRegistered: (state, action: PayloadAction<boolean>) => {
      state.registered = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setAccount, setError, clearError, setIsRegistered } =
  appSlice.actions;

export default appSlice.reducer;
