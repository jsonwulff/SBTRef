import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Card } from './cardsSlice';
import { PlayerInfo } from './playersSlice';

export interface TradeState {
  trader: PlayerInfo | null;
  traderCards: Card[];
  offer: string[];
  wants: string[];
}

const initialState: TradeState = {
  trader: null,
  traderCards: [],
  offer: [],
  wants: [],
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
    setOffer: (state, action: PayloadAction<string>) => {
      const isInOffer = state.offer.includes(action.payload);
      if (isInOffer) {
        state.offer = state.offer.filter((id) => id !== action.payload);
      } else {
        state.offer.push(action.payload);
      }
    },
    setWants: (state, action: PayloadAction<string>) => {
      const isInWants = state.wants.includes(action.payload);
      if (isInWants) {
        state.wants = state.wants.filter((id) => id !== action.payload);
      } else {
        state.wants.push(action.payload);
      }
    },
  },
});

export const { setTrader, setOffer, setWants, setTraderCards } =
  tradeSlice.actions;

export default tradeSlice.reducer;
