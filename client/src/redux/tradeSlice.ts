import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Card } from './cardsSlice';
import { PlayerInfo } from './playersSlice';

export interface TradeOffer {
  tradeId: string;
  sender: string;
  reciever: string;
}

export interface TradeOfferedEvent extends TradeOffer {
  0: string;
  1: string;
  2: string;
}

export interface TradeStruct {
  id: string;
  offerer: string;
  reciever: string;
  offers: string[];
  wants: string[];
  closed: boolean;
}
export interface Trade extends TradeStruct {}

export interface TradeFromContract extends TradeStruct {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
}

export interface TradeWithCardDetails extends Omit<Trade, 'offers' | 'wants'> {
  offers: Card[];
  wants: Card[];
}

export interface TradeState {
  trader: PlayerInfo | null;
  traderCards: Card[];
  offer: string[];
  wants: string[];
  trades: TradeWithCardDetails[];
}

const initialState: TradeState = {
  trader: null,
  traderCards: [],
  offer: [],
  wants: [],
  trades: [],
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
    setTrades: (state, action: PayloadAction<TradeWithCardDetails[]>) => {
      state.trades = action.payload;
    },
    clearTrade: (state) => {
      state.offer = [];
      state.wants = [];
    },
  },
});

export const {
  setTrader,
  setOffer,
  setWants,
  setTraderCards,
  setTrades,
  clearTrade,
} = tradeSlice.actions;

export default tradeSlice.reducer;
