import { Card } from '../redux/cardsSlice';

export const cardSortBy: { text: string; value: keyof Card }[] = [
  { text: 'ID', value: 'id' },
  { text: 'Traded', value: 'traded' },
  { text: 'Type', value: 'cardType' },
  { text: 'Rarity', value: 'rarity' },
  { text: 'Strength', value: 'str' },
  { text: 'Defense', value: 'def' },
  { text: 'Health', value: 'hlt' },
];
