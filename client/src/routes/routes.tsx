import { Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { CardStorePage } from '../pages/CardStorePage/CardStorePage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { FrontPage } from '../pages/FrontPage/FrontPage';
import { MyCardsPage } from '../pages/MyCardsPage/MyCardsPage';
import { MyProfilePage } from '../pages/MyProfilePage/MyProfilePage';
import { OfferPage } from '../pages/TradeCardsPage/OfferPage/OfferPage';
import { TradeCardsPage } from '../pages/TradeCardsPage/TradeCardsPage';
import { RequireRegistered } from './RequireRegistered';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<FrontPage />} />
      </Route>
      <Route
        path="/app"
        element={
          <RequireRegistered>
            <Layout />
          </RequireRegistered>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="my-cards" element={<MyCardsPage />} />
        <Route path="card-store" element={<CardStorePage />} />
        <Route path="trade-cards" element={<TradeCardsPage />} />
        <Route path="trade-cards/:address" element={<OfferPage />} />
        <Route path="my-profile" element={<MyProfilePage />} />
      </Route>
    </Routes>
  );
};
