import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import { signIn, signOut } from 'next-auth/react';

type NavbarProps = {
  loggedIn: boolean,
}

const Navbar: FunctionComponent<NavbarProps> = ({ loggedIn }) => (
  <Box>
    <AppBar position="static">
      <Toolbar>
        <Link href="tournaments" passHref><Button color="inherit">Tournaments</Button></Link>
        <Link href="templates" passHref><Button color="inherit">Templates</Button></Link>
        <div style={{ flex: 1 }} />
        {
            loggedIn ? <Button color="error" variant="contained" onClick={() => signOut()}>Log Out</Button>
              : <Button color="success" variant="contained" onClick={() => signIn()}>Log In</Button>
          }
      </Toolbar>
    </AppBar>
  </Box>
);

export default Navbar;
