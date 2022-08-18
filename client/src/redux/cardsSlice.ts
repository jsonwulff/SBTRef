import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface Card {
  id: string;
  traded: string;
  cardType: string;
  rarity: string;
  str: string;
  def: string;
  hlt: string;
}

export interface CardsState {
  myCards: Card[];
  packCost: number | null;
}

const initialState: CardsState = {
  myCards: [],
  packCost: null,
};

export const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setMyCards: (state, action: PayloadAction<Card[]>) => {
      state.myCards = action.payload;
    },
    setPackCost: (state, action: PayloadAction<number>) => {
      state.packCost = action.payload;
    },
  },
});

export const { setMyCards, setPackCost } = cardsSlice.actions;

export default cardsSlice.reducer;
