import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { tokContract } from '../web3/provider';
import { AppThunkDispatch } from './store';

export interface Card {
  id: string;
  ownerAddress: string;
}
export interface CardsState {
  cards: Card[];
}

const initialState: CardsState = {
  cards: [],
};

export const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setCards: (state, action: PayloadAction<Card[]>) => {
      state.cards = action.payload;
    },
  },
});

export const { setCards } = cardsSlice.actions;

export default cardsSlice.reducer;

export const getAllCards = () => (dispatch: AppThunkDispatch) => {
  tokContract
    .getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest' })
    .then((events) => {
      // events.forEach((e) => console.log(e.returnValues));
      const cards: Card[] = events.map((e) => ({
        id: e.returnValues.tokenId,
        ownerAddress: e.returnValues.to,
      }));
      dispatch(setCards(cards));
    });
};
