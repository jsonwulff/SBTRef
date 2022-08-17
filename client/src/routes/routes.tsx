import { Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { FrontPage } from '../pages/FrontPage/FrontPage';
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
      </Route>
    </Routes>
  );
};
