import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './App';
import { GlobalStylesOveride } from './components/Layout/GlobalStylesOveride';
import { store } from './redux/store';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <GlobalStylesOveride />
    <App />
  </Provider>
  // </React.StrictMode>
);

reportWebVitals();
