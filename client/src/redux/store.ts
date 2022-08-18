import { AnyAction, configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import appSlice from './appSlice';
import cardsSlice from './cardsSlice';
import playersSlice from './playersSlice';

export const store = configureStore({
  reducer: {
    app: appSlice,
    cards: cardsSlice,
    players: playersSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunkDispatch = ThunkDispatch<RootState, void, AnyAction>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
