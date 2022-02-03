import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import { signIn, signOut } from 'next-auth/react'

type NavbarProps = {
  loggedIn: boolean,
  page: string,
}

const Navbar: FunctionComponent<NavbarProps> = ({ loggedIn, page }) => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Link href={'tournaments'}><Button color="inherit">Tournaments</Button></Link>
          <Link href={'templates'}><Button color="inherit" >Templates</Button></Link>
          <div style={{flex: 1}}></div>
          {
            loggedIn ? <Button color="error" variant="contained" onClick={() => signOut()}>Log Out</Button>
            : <Button color="success" variant="contained" onClick={() => signIn()}>Log In</Button>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;