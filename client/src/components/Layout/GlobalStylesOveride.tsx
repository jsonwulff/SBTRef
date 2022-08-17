import GlobalStyles from '@mui/material/GlobalStyles';
import { GlobalStylesProps } from '@mui/system';

const myGlobalStyles: GlobalStylesProps['styles'] = {
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
  },
  html: {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    height: '100%',
    width: '100%',
  },
  body: {
    backgroundColor: '#f4f6f8',
    height: '100%',
    width: '100%',
  },
  a: {
    textDecoration: 'none',
  },
  '#root': {
    height: '100%',
    width: '100%',
  },
};

const inputGlobalStyles = <GlobalStyles styles={myGlobalStyles} />;

export const GlobalStylesOveride = () => {
  return <> {inputGlobalStyles} </>;
};
