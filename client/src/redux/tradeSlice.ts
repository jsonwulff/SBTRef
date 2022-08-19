import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Card } from './cardsSlice';
import { PlayerInfo } from './playersSlice';

export interface TradeState {
  trader: PlayerInfo | null;
  traderCards: Card[];
}

const initialState: TradeState = {
  trader: null,
  traderCards: [],
};

export const tradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    setTrader: (state, action: PayloadAction<PlayerInfo>) => {
      state.trader = action.payload;
    },
    setTraderCards: (state, action: PayloadAction<Card[]>) => {
      state.traderCards = action.payload;
    },
  },
});

export const { setTrader, setTraderCards } = tradeSlice.actions;

export default tradeSlice.reducer;
