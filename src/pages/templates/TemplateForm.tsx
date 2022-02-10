import {
  FormControl, Box, TextField, Button,
} from '@mui/material';
import { Formik, FieldArray } from 'formik';
import React, { FunctionComponent } from 'react';
import * as Yup from 'yup';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { TemplateCreationAttributes } from '../../models/TemplateModel';
import ErrorMessage from '../components/ErrorMessage';

type FormProps = {
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void,
  // eslint-disable-next-line no-unused-vars
  addTemplate: (template: TemplateCreationAttributes) => void,
}

const TemplateForm: FunctionComponent<FormProps> = ({ setOpen, addTemplate }) => {
  const error = {
    color: 'red',
  };

  return (
    <Formik
      initialValues={{ name: '', templateEvents: [] }}
      validationSchema={
      Yup.object({
        name: Yup.string()
          .max(100, 'Must be 100 characters or less')
          .required('Required'),
        templateEvents: Yup.array()
          .of(
            Yup.object().shape({
              name: Yup.string()
                .max(100, 'Must be 100 characters or less')
                .required('Required'),
              minutes: Yup.number()
                .min(0, 'Test can\'t have a negative time limit')
                .max(1440, 'Test must be under 1440 minutes long')
                .required('Required'),
            }),
          )
          .required('Must have events')
          .min(1, 'Must have at least 1 event'),
      })
    }
      onSubmit={async (values, { setSubmitting }) => {
        const res = await fetch(
          '/api/templates',
          {
            body: JSON.stringify(values),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          },
        );
        const template = await res.json();
        addTemplate(template);
        setSubmitting(false);
        setOpen(false);
      }}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth margin="normal">
            <Box sx={{ marginBottom: '10px' }}>
              <TextField
                id="name"
                label="Template Name"
                variant="outlined"
                sx={{ display: 'block' }}
                fullWidth
                {...formik.getFieldProps('name')}
              />
              {formik.touched.name && formik.errors.name ? (
                <Box sx={error}>{formik.errors.name}</Box>
              ) : null}
            </Box>
            <FieldArray
              name="templateEvents"
              render={(arrayHelpers) => (
                <div style={{ width: 'auto' }}>
                  {formik.values.templateEvents && formik.values.templateEvents.length > 0 ? (
                    formik.values.templateEvents.map((event, index) => (
                      <div
                        key={event.id}
                        style={{
                          marginBottom: '10px', display: 'flex', flexDirection: 'row', alignContent: 'center',
                        }}
                      >
                        <div style={{ flexGrow: 1, marginRight: '10px' }}>
                          <TextField label="Name" {...formik.getFieldProps(`templateEvents[${index}].name`)} fullWidth />
                          <ErrorMessage name={`templateEvents[${index}].name`} />
                        </div>
                        <div>
                          <TextField {...formik.getFieldProps(`templateEvents[${index}].minutes`)} label="Minutes" />
                          <ErrorMessage name={`templateEvents[${index}].minutes`} />
                        </div>
                        <Button onClick={() => arrayHelpers.remove(index)}>
                          <RemoveCircleOutlineIcon />
                        </Button>
                        <Button onClick={() => arrayHelpers.insert(index + 1, { name: '', minutes: '' })}>
                          <AddCircleIcon />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <Button variant="outlined" fullWidth onClick={() => arrayHelpers.push({ name: '', minutes: '' })}>
                      Add event
                    </Button>
                  )}
                </div>
              )}
            />
            {
              typeof formik.errors.templateEvents === 'string' ? <div style={{ ...error, marginBottom: '10px' }}>{formik.errors.templateEvents}</div> : <div style={{ ...error, marginBottom: '10px' }} />
            }

            <Button
              type="submit"
              variant="contained"
            >
              Save
            </Button>
          </FormControl>
        </form>
      )}
    </Formik>
  );
};

export default TemplateForm;
