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

type FormProps = {
  templates: Array<{
    id: string,
    name: string,
  }>,
  setOpen: (open: boolean) => void,
}

const TournamentForm: FunctionComponent<FormProps> = ({ templates, setOpen }) => {
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
    onSubmit={(values, { setSubmitting }) => {
      setTimeout(() => {
        setOpen(false);
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 400)
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
              >
                {templates.map(template => (
                  <MenuItem id={template.id} value={template.id}>{template.name}</MenuItem>
                ))}
              </TextField>
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

const TournamentCreationButton: FunctionComponent = () => {
  const [open, setOpen] = React.useState(false);
  //const [templates, setTemplates] = React.useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const templates = [
    {
      id: 'old',
      name: '2021',
    },
    {
      id: 'new',
      name: '2022'
    }
  ]

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
          <TournamentForm templates={templates} setOpen={setOpen}/>
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

const Dashboard: NextPage = () => {
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
                <TableCell colSpan={3}>
                  <TournamentCreationButton/>
                </TableCell>
              </TableRow>
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

export default Dashboard
