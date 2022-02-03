import type { NextPage } from 'next'
import { signIn, useSession } from 'next-auth/react'
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
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
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { FormControl } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Navbar from './Navbar';
import { SERVER, PORT } from '../configLoader';
import { TemplateAttributes, TournamentAttributes, TournamentCreationAttributes } from '../models';

type FormProps = {
  templates: Array<TemplateAttributes>,
  setOpen: (open: boolean) => void,
  addTournament: (tournament: TournamentCreationAttributes) => void, 
}

const TournamentForm: FunctionComponent<FormProps> = ({ templates, setOpen, addTournament }) => {
  const error = {
    color: "red"
  }
  return(
  <Formik
    initialValues={{ name: '', template: '', submission: '' }}
    validationSchema={
      Yup.object({
        name: Yup.string()
          .max(100, 'Must be 100 characters or less')
          .required('Required'),
        template: Yup.string().required('Required'),
        submission: Yup.string()
          .max(100, 'Must be 100 characters or less')
          .required('Required')
      })
    }
    onSubmit={async(values, { setSubmitting }) => {
        const res = await fetch(
          '/api/tournaments',
          {
            body: JSON.stringify(values),
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'POST'
          }
        )
        const template = await res.json();
        addTournament(template);
        setSubmitting(false);
        setOpen(false);
    }}
    >
      {formik => (
        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth margin='normal'>
            <Box sx={{"marginBottom": "10px"}}>
              <TextField 
                id = "name"
                label ="Tournament Name" 
                variant ="outlined" 
                sx={{"display": "block"}}
                fullWidth
                {...formik.getFieldProps('name')}
              />
              {formik.touched.name && formik.errors.name ? (
                <Box sx={error}>{formik.errors.name}</Box>
              ) : null}
            </Box>

            <Box sx={{"marginBottom": "10px"}}>
              <TextField 
                id = "submission"
                label ="Submission Form Link  " 
                variant ="outlined" 
                sx={{"display": "block"}}
                fullWidth
                {...formik.getFieldProps('submission')}
              />
              {formik.touched.submission && formik.errors.submission ? (
                <Box sx={error}>{formik.errors.submission}</Box>
              ) : null}
            </Box>

            <Box sx={{"marginBottom": "10px"}}>
              <TextField 
                name="template"
                label="Template"
                value={formik.values.template}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                fullWidth
                select
                children={
                  templates ? templates.map(template => (
                    <MenuItem key={template.id} id={template.id} value={template.id}>{template.name}</MenuItem>
                  )): null
                }
              />
              {formik.touched.template && formik.errors.template ? (
                <Box sx={error}>{formik.errors.template}</Box>
              ) : null}
            </Box>

            <Button 
              type="submit"
              variant="contained">Create</Button>
          </FormControl>
        </form>
      )}
    </Formik>
  )
}

type TournamentCreationButtonProps = {
  templates: Array<TemplateAttributes>
  addTournament: (tournament: TournamentCreationAttributes) => void, 
}

const TournamentCreationButton: FunctionComponent<TournamentCreationButtonProps> = ({ templates, addTournament }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2
  };

  return (
    <>
      <Button fullWidth onClick={handleOpen}>
        <AddIcon/>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <TournamentForm templates={templates} setOpen={setOpen} addTournament={addTournament}/>
        </Box>
      </Modal>
    </>
  )
}

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

type PageProps = {
  templates: Array<TemplateAttributes>,
  initialTournaments: Array<TournamentAttributes>,
}

const Tournaments: NextPage<PageProps> = ({ templates, initialTournaments }) => {
  const { data: session } = useSession();
  const [tournaments, setTournaments] = React.useState(initialTournaments);

  const addTournament = (tournament) => {
    setTournaments(tournaments.concat(tournament));
  }
  
  if (session) {
    return (
      <>
      <Navbar loggedIn={session ? true : false} page={"index"}/>
      <Container maxWidth="sm" sx={{paddingTop: "20px"}}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell colSpan={3}>
                  <TournamentCreationButton templates={templates} addTournament={addTournament}/>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tournament</TableCell>
                <TableCell align="right">Active?</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tournaments ? tournaments.map((tournament) => (
                <TournamentRow key={tournament.id} name={tournament.name} active={tournament.active}/>
              )): null}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      </>
    )
  }
  return (
    <>
      Not signed in
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

export async function getServerSideProps() {
  const templatesRes = await fetch(`${SERVER}:${PORT}/api/templates`);
  const tournamentsRes = await fetch(`${SERVER}:${PORT}/api/tournaments`);
  const templates = await templatesRes.json();
  const initialTournaments = await tournamentsRes.json();
  return { props: { templates, initialTournaments } };
}

export default Tournaments
