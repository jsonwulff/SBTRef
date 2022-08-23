import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
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
import { cardSortBy } from '../../constants/componentMappings';
import { Card, setMyCards } from '../../redux/cardsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { dynamicSort, Order } from '../../utils';
import { getCardsWithStatsByOwner } from '../../web3/interfaces/TokenContract';
import { CardDisplay } from './CardDisplay';
import { ListDisplay } from './ListDisplay';
import { Tab } from './Tab';

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
    console.log('clicked');
    const isAsc = sortBy === sortByProp && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setSortBy(sortByProp);
  };

  const handleToggleView = () => {
    setListView((prevState) => !prevState);
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
            <Tab rarity={0} numCards={32} />
            <Tab rarity={3} numCards={32} />
            <Tab rarity={2} numCards={32} />
            <Tab rarity={1} numCards={32} />
          </Tabs>
          <Box>
            <SelectDropDown
              label="Sort by"
              value={sortBy}
              selectItems={cardSortBy}
              onChange={handleChange}
            />
            <IconButton onClick={handleToggleView}>
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
            cards={[...myCards].sort(dynamicSort(sortBy, order))}
            sortBy={sortBy}
            order={order}
            onRequestSort={handleSortRequest}
          />
        ) : (
          <CardContent>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {[...myCards].sort(dynamicSort(sortBy, 'desc')).map((card) => (
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
