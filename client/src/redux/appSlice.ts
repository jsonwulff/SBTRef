import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface AppState {
  account: string;
}

const initialState: AppState = {
  account: '0',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<string>) => {
      state.account += action.payload;
    },
  },
});

export const { setAccount } = appSlice.actions;

export default appSlice.reducer;
