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
}

const initialState: CardsState = {
  myCards: [],
};

export const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setMyCards: (state, action: PayloadAction<Card[]>) => {
      state.myCards = action.payload;
    },
  },
});

export const { setMyCards } = cardsSlice.actions;

export default cardsSlice.reducer;
