import { FormControl, Box, TextField, Button } from "@mui/material"
import { Formik, FieldArray, useField } from "formik"
import { FunctionComponent } from "react"
import { TemplateCreationAttributes } from "../../models/TemplateModel";
import * as Yup from 'yup'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';

type FormProps = {
  setOpen: (open: boolean) => void,
  addTemplate: (template: TemplateCreationAttributes) => void,
}

const TemplateForm: FunctionComponent<FormProps> = ({ setOpen, addTemplate }) => {
  const error = {
    color: "red"
  }

  return(
  <Formik
    initialValues={{ name: '', template_events: [] }}
    validationSchema={
      Yup.object({
        name: Yup.string()
          .max(100, 'Must be 100 characters or less')
          .required('Required'),
        template_events: Yup.array()
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
    onSubmit={async(values, { setSubmitting }) => {
      const res = await fetch(
        '/api/templates',
        {
          body: JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST'
        }
      )
      const template = await res.json();
      addTemplate(template);
      setSubmitting(false);
      setOpen(false);
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
              name="template_events"
              render={arrayHelpers => {                
                const ErrorMessage = ({ name }) => {
                    const [field, meta, helpers] = useField(name);   
                    return meta.touched && meta.error ? <Box sx={error}>{meta.error}</Box> : null;
                };

                return(
                  <div style={{width: "auto"}}>
                    {formik.values.template_events && formik.values.template_events.length > 0 ? (
                      formik.values.template_events.map((event, index) => (
                        <div key={index} style={{ marginBottom: "10px", display: "flex", flexDirection: "row", alignContent: "center" }}>
                          <div style={{ flexGrow: 1, marginRight: "10px" }}>
                            <TextField label='Name' {...formik.getFieldProps(`template_events[${index}].name`)} fullWidth/>
                            <ErrorMessage name={`template_events[${index}].name`} />
                          </div>
                          <div>
                            <TextField {...formik.getFieldProps(`template_events[${index}].minutes`)} label='Minutes'/>
                            <ErrorMessage name={`template_events[${index}].minutes`} />
                          </div>
                          <Button onClick={() => arrayHelpers.remove(index)}>
                            <RemoveCircleOutlineIcon/>
                          </Button>
                          <Button onClick={() => arrayHelpers.insert(index+1, {name: '', minutes: ''})}>
                            <AddCircleIcon/>
                          </Button>
                        </div>
                      ))
                    ): (
                      <Button variant="outlined" fullWidth onClick={() => arrayHelpers.push({ name: '', minutes: ''})} >
                        Add event
                      </Button>
                    )}
                  </div>
                )}}
            />
            { 
              typeof formik.errors.template_events === 'string' ? <div style={{ ...error, marginBottom: "10px"}}>{formik.errors.template_events}</div> : <div style={{ ...error, marginBottom: "10px"}}/>
            }

            <Button 
              type="submit"
              variant="contained">Save</Button>
          </FormControl>
        </form>
      )}
    </Formik>
  )
}

export default TemplateForm;