import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface PlayerStruct {
  trades: string;
  playerLevel: string;
  reputation: string;
}

export interface PlayerStructFromContract extends PlayerStruct {
  0: string;
  1: string;
  2: string;
}

export interface PlayerStructWithAddress extends PlayerStruct {
  address: string;
}

export interface PlayerInfo {
  nickname: string;
  address: string;
  trades: string;
  playerLevel: string;
  reputation: string;
  numCards: string;
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
