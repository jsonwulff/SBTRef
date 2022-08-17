import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/routes';
import { useStartApp } from './web3/hooks/useStartApp';

export const App = () => {
  useStartApp();

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
