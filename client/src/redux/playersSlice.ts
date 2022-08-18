import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface PlayerInfo {
  address: string;
  trades: string;
  playerLevel: string;
  reputation: string;
}

export interface PlayerState {
  players: PlayerInfo[];
}

const initialState: PlayerState = {
  players: [],
};

export const playerSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setPlayers: (state, action: PayloadAction<PlayerInfo[]>) => {
      state.players = action.payload;
    },
  },
});

export const { setPlayers } = playerSlice.actions;

export default playerSlice.reducer;
