import type { NextPage } from 'next'
import { signIn, useSession } from 'next-auth/react'
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
import TextField from '@mui/material/TextField';
import * as Yup from 'yup';
import { Field, FieldArray, Formik, getIn } from 'formik';
import { FormControl, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Navbar from './Navbar';

type FormProps = {
  templates: Array<{
    id: string,
    name: string,
  }>,
  setOpen: (open: boolean) => void,
}

const TemplateForm: FunctionComponent<FormProps> = ({ setOpen }) => {
  const error = {
    color: "red"
  }
  return(
  <Formik
    initialValues={{ name: '', events: [] }}
    validationSchema={
      Yup.object({
        name: Yup.string()
          .max(100, 'Must be 100 characters or less')
          .required('Required'),
        events: Yup.array()
          .of(
            Yup.object().shape({
              name: Yup.string()
                .max(100, 'Must be 100 characters or less')
                .required('Required'),
              minutes: Yup.number()
                .min(0, 'Test can\'t have a negative time limit')
                .max(1440, 'Test must be under 1440 minutes long')
                .required('Required')
            })
          )
          .required('Must have events')
          .min(1, 'Must have at least 1 event'),
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
            <Box sx={{marginBottom: "10px"}}>
              <TextField 
                id = "name"
                label ="Template Name" 
                variant ="outlined" 
                sx={{"display": "block"}}
                fullWidth
                {...formik.getFieldProps('name')}
              />
              {formik.touched.name && formik.errors.name ? (
                <Box sx={error}>{formik.errors.name}</Box>
              ) : null}
            </Box>
            <FieldArray
              name="events"
              render={arrayHelpers => {                
                const ErrorMessage = ({ name }) => {
                    const error = getIn(formik.errors, name);
                    const touch = getIn(formik.touched, name);
                    console.log(error);
                    console.log(touch);
                    return touch && error ? <Box sx={error}>{formik.errors.name}</Box> : null;
                };

                return(
                  <div style={{width: "auto"}}>
                    {formik.values.events && formik.values.events.length > 0 ? (
                      formik.values.events.map((event, index) => (
                        <div key={index} style={{ marginBottom: "10px", display: "flex", flexDirection: "row", alignContent: "center" }}>
                          <div style={{ flexGrow: 1, marginRight: "10px" }}>
                            <TextField name={`events[${index}].name`} label='Name' fullWidth/>
                            <ErrorMessage name={`events[${index}].name`} />
                          </div>
                          <div>
                            <TextField name={`events[${index}].minutes`} label='Minutes'/>
                            <ErrorMessage name={`events[${index}].minutes`} />
                          </div>
                          <Button onClick={() => arrayHelpers.remove(index)}>
                            <RemoveCircleOutlineIcon/>
                          </Button>
                          <Button onClick={() => arrayHelpers.insert(index, {name: '', time: ''})}>
                            <AddCircleIcon/>
                          </Button>
                        </div>
                      ))
                    ): (
                      <Button fullWidth onClick={() => arrayHelpers.push('')} sx={{ marginBottom: "10px" }}>
                        Add event
                      </Button>
                    )}
                  </div>
                )}}
            />

            <Button 
              type="submit"
              variant="contained">Save</Button>
          </FormControl>
        </form>
      )}
    </Formik>
  )
}

const TemplateCreationButton: FunctionComponent = () => {
  const [open, setOpen] = React.useState(false);
  //const [templates, setTemplates] = React.useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
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
          <TemplateForm setOpen={setOpen}/>
        </Box>
      </Modal>
    </>
  )
}

type Props = {
  id: string
  name: string,
}

const TemplateRow: FunctionComponent<Props> = ({id, name}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return(
    <>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <h1>Hi!</h1>
      </Modal>
      <TableRow
        key={id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {name}
        </TableCell>
        <TableCell align="right">
          <Button onClick={handleOpen}>Edit</Button>
        </TableCell>
      </TableRow>
    </>
  )
};

const Templates: NextPage = () => {
  const { data: session } = useSession();

  const templates = [
    {id: 'test', name: 'Test'}
  ];
  
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
                  <TemplateCreationButton/>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Template</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((template) => (
                <TemplateRow id={template.id} name={template.name}/>
              ))}
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

export default Templates
