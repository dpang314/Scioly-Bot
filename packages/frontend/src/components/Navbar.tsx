import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import {FunctionComponent} from 'react';
import {login, logout} from '../api/auth';
import UserContext from '../providers/UserContext';
import {Avatar, Link} from '@mui/material';
import logo from '../assets/logo.png';

const Navbar: FunctionComponent = () => {
  const user = React.useContext(UserContext);
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Link href="/">
            <Avatar src={logo} alt="logo" sx={{marginRight: '10px'}} />
          </Link>
          {user ? (
            <>
              <Button href="/tournaments" color="inherit">
                Tournaments
              </Button>
              <Button href="/templates" color="inherit">
                Templates
              </Button>
            </>
          ) : (
            <></>
          )}

          <div style={{flex: 1}} />
          {user === null ? (
            <Button color="success" variant="contained" onClick={login}>
              Log In
            </Button>
          ) : user === undefined ? null : (
            <Button color="error" variant="contained" onClick={logout}>
              Log Out
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
