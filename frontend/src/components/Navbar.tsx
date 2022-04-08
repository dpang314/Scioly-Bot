import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { FunctionComponent } from 'react';

type NavbarProps = {
  loggedIn: boolean,
}

const Navbar: FunctionComponent<NavbarProps> = ({ loggedIn }) => (
  <Box>
    <AppBar position="static">
      <Toolbar>
        <a href="tournaments"><Button color="inherit">Tournaments</Button></a>
        <a href="templates"><Button color="inherit">Templates</Button></a>
        <div style={{ flex: 1 }} />
        {
            loggedIn ? <Button color="error" variant="contained" onClick={() => {}}>Log Out</Button>
              : <Button color="success" variant="contained" onClick={() => {}}>Log In</Button>
          }
      </Toolbar>
    </AppBar>
  </Box>
);

export default Navbar;
