import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
  
export default function Navbar() {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit">Tournaments</Button>
          <Button color="inherit">Templates</Button>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}