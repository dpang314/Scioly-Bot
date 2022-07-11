import * as React from 'react';
import {FunctionComponent} from 'react';
import {CircularProgress} from '@mui/material';

const Loading: FunctionComponent = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      minHeight: '100vh',
    }}>
    <CircularProgress />
  </div>
);

export default Loading;
