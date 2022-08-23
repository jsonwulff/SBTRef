import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import {
  Box,
  Card as MuiCard,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  IconButton,
  SelectChangeEvent,
  Tabs,
  Tooltip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { SelectDropDown } from '../../components/SelectDropDown';
import { RarityAndAll } from '../../constants/cardMappings';
import { cardSortBy } from '../../constants/componentMappings';
import { Card, setMyCards } from '../../redux/cardsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { dynamicSort, Order } from '../../utils';
import { getCardsWithStatsByOwner } from '../../web3/interfaces/TokenContract';
import { CardDisplay } from './CardDisplay';
import { ListDisplay } from './ListDisplay';
import { Tab } from './Tab';

interface TabCount {
  '0': number;
  '1': number;
  '2': number;
  '3': number;
}
const tabCount: TabCount = { '0': 0, '1': 0, '2': 0, '3': 0 };

export const MyCardsPage = () => {
  const { account, myCards } = useAppSelector((state) => ({
    account: state.app.account,
    myCards: state.cards.myCards,
  }));
  const dispatch = useAppDispatch();
  const [isListView, setListView] = useState(false);
  const [sortBy, setSortBy] = useState<keyof Card>(cardSortBy[3].value);
  const [order, setOrder] = useState<Order>('desc');
  const [filterRarity, setFilterRarity] = useState(0);
  const [numCards, setNumCards] = useState(tabCount);

  useEffect(() => {
    setNumCards(
      myCards.reduce(
        (total: TabCount, currentValue) => ({
          ...total,
          0: total[0] + 1,
          [currentValue.rarity]:
            Number(total[currentValue.rarity as RarityAndAll]) + 1,
        }),
        tabCount
      )
    );
  }, [myCards]);

  useEffect(() => {
    getCardsWithStatsByOwner(account).then((result) => {
      dispatch(setMyCards(result));
    });
  }, [account, dispatch]);

  const handleChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as keyof Card);
  };

  const handleOnFilterRarity = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setFilterRarity(newValue);
  };

  const handleSortRequest = (
    event: React.MouseEvent<unknown>,
    sortByProp: keyof Card
  ) => {
    const isAsc = sortBy === sortByProp && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setSortBy(sortByProp);
  };

  const handleToggleView = () => {
    setListView((prevState) => !prevState);
  };

  const handleToggleOrder = () => {
    setOrder((prevState) => (prevState === 'desc' ? 'asc' : 'desc'));
  };

  return (
    <Container sx={{ pb: 4 }}>
      <MuiCard>
        <CardHeader
          title="My Cards"
          titleTypographyProps={{ variant: 'h4', sx: { fontWeight: 700 } }}
        />
        <Divider />
        <CardContent
          sx={(theme) => ({
            display: 'flex',
            backgroundColor: theme.palette.grey[100],
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1,
          })}
        >
          <Tabs value={filterRarity} onChange={handleOnFilterRarity}>
            <Tab rarity={0} numCards={numCards[0]} value={0} />
            <Tab rarity={3} numCards={numCards[3]} value={3} />
            <Tab rarity={2} numCards={numCards[2]} value={2} />
            <Tab rarity={1} numCards={numCards[1]} value={1} />
          </Tabs>
          <Box>
            <SelectDropDown
              label="Sort by"
              value={sortBy}
              selectItems={cardSortBy}
              onChange={handleChange}
              FormControlProps={{ sx: { width: '130px' } }}
            />
            <IconButton onClick={handleToggleOrder} sx={{ ml: 1 }}>
              <Tooltip
                arrow
                title={
                  order === 'desc'
                    ? 'Sort in ascending order'
                    : 'Sort in descending order'
                }
              >
                {order === 'desc' ? (
                  <SortRoundedIcon />
                ) : (
                  <SortRoundedIcon sx={{ transform: 'scaleY(-1)' }} />
                )}
              </Tooltip>
            </IconButton>
            <IconButton onClick={handleToggleView} sx={{ ml: 1 }}>
              <Tooltip
                arrow
                title={isListView ? 'Show in card view' : 'Show in list view'}
              >
                {isListView ? <GridViewRoundedIcon /> : <ViewListRoundedIcon />}
              </Tooltip>
            </IconButton>
          </Box>
        </CardContent>
        <Divider />
        {isListView ? (
          <ListDisplay
            cards={[...myCards]
              .filter(
                (card) =>
                  Number(card.rarity) === filterRarity || filterRarity === 0
              )
              .sort(dynamicSort(sortBy, order))}
            sortBy={sortBy}
            order={order}
            onRequestSort={handleSortRequest}
          />
        ) : (
          <CardContent>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {[...myCards]
                .filter(
                  (card) =>
                    Number(card.rarity) === filterRarity || filterRarity === 0
                )
                .sort(dynamicSort(sortBy, order))
                .map((card) => (
                  <Grid key={card.id} item xs={12} sm={6} md={4} lg={3}>
                    <CardDisplay card={card} />
                  </Grid>
                ))}
            </Grid>
          </CardContent>
        )}
      </MuiCard>
    </Container>
  );
};
