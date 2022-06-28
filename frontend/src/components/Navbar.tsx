import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

type NavbarProps = {
  loggedIn: boolean,
}

const Navbar: FunctionComponent<NavbarProps> = ({ loggedIn }) => {
  
  return(
  <Box>
    <AppBar position="static">
      <Toolbar>
        <Button href="/tournaments" color="inherit">Tournaments</Button>
        <Button href="/templates" color="inherit">Templates</Button>
        <div style={{ flex: 1 }} />
        {
            loggedIn ? <Button color="error" variant="contained" onClick={() => {}}>Log Out</Button>
              : <Button color="success" variant="contained" onClick={login}>Log In</Button>
          }
      </Toolbar>
    </AppBar>
  </Box>
)};

export default Navbar;
