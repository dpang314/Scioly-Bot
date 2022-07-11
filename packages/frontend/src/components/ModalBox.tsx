import Box from '@mui/material/Box';
import * as React from 'react';

const ModalBox = ({children}: {children: React.ReactNode}) => (
  <Box
    sx={{
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 800,
      bgcolor: 'background.paper',
      boxShadow: 24,
      paddingTop: 4,
      paddingLeft: 4,
      paddingRight: 4,
      paddingBottom: 2,
      borderRadius: 2,
      overflowY: 'scroll',
      maxHeight: '90vh',
    }}>
    {children}
  </Box>
);

export default ModalBox;
