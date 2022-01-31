import type { NextPage } from 'next'
import { signIn, signOut, useSession } from 'next-auth/react'
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import React, { FunctionComponent } from 'react';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

type Props = {
  name: string,
  active: boolean,
}

const TournamentRow: FunctionComponent<Props> = ({name, active}) => {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState(active);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const toggleStatus = () => {
    setStatus(!status);
  };

  return(
    <>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <h1>Hi!</h1>
      </Modal>
      <TableRow
        key={name}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {name}
        </TableCell>
        <TableCell align="right">
          <Switch 
            onChange={toggleStatus} 
            checked={status} 
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </TableCell>
        <TableCell align="right">
          <Button onClick={handleOpen}>Edit</Button>
        </TableCell>
      </TableRow>
    </>
  )
};

const Home: NextPage = () => {
  const { data: session } = useSession();

  const tournaments = [
    {name: 'Test', active: false},
  ];
  
  if (session) {
    return (
      <Container maxWidth="sm">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Tournament</TableCell>
                <TableCell align="right">Active?</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tournaments.map((tournament) => (
                <TournamentRow name={tournament.name} active={tournament.active}/>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    )
  }
  return (
    <>
      Not signed in
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

export default Home
