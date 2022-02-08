import { FormControl, Box, TextField, MenuItem, Button } from "@mui/material"
import { Formik } from "formik"
import { FunctionComponent } from "react"
import { TemplateAttributes } from "../../models"
import * as Yup from 'yup'
import { AddTournament } from "."

type FormProps = {
  templates: Array<TemplateAttributes>,
  setOpen: (open: boolean) => void,
  addTournament: AddTournament,
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

export default TournamentForm;