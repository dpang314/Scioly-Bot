/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import '../styles/globals.css';
import * as React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#333333',
    },
  },
});

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <SessionProvider session={session}>
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  </SessionProvider>
);

export default App;
