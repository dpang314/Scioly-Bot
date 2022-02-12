import {
  FormControl, Box, TextField, MenuItem, Button,
} from '@mui/material';
import { Formik } from 'formik';
import React, { FunctionComponent } from 'react';
import * as Yup from 'yup';
import { TemplateAttributes, TournamentAttributes } from '../../models';
import { urlRegex } from '../../util';

// eslint-disable-next-line no-unused-vars
export type AddTournament = (tournament: TournamentAttributes) => void;

type FormProps = {
  templates: Array<TemplateAttributes>,
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void,
  addTournament: AddTournament,
}

const TournamentForm: FunctionComponent<FormProps> = ({ templates, setOpen, addTournament }) => {
  const error = {
    color: 'red',
  };
  return (
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
          .matches(urlRegex, 'Must be a valid URL')
          .required('Required'),
      })
    }
      onSubmit={async (values, { setSubmitting }) => {
        const res = await fetch(
          '/api/tournaments',
          {
            body: JSON.stringify(values),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          },
        );
        const template = await res.json();
        addTournament(template);
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
                label="Tournament Name"
                variant="outlined"
                sx={{ display: 'block' }}
                fullWidth
                {...formik.getFieldProps('name')}
              />
              {formik.touched.name && formik.errors.name ? (
                <Box sx={error}>{formik.errors.name}</Box>
              ) : null}
            </Box>

            <Box sx={{ marginBottom: '10px' }}>
              <TextField
                id="submission"
                label="Submission Form Link  "
                variant="outlined"
                sx={{ display: 'block' }}
                fullWidth
                {...formik.getFieldProps('submission')}
              />
              {formik.touched.submission && formik.errors.submission ? (
                <Box sx={error}>{formik.errors.submission}</Box>
              ) : null}
            </Box>

            <Box sx={{ marginBottom: '10px' }}>
              <TextField
                name="template"
                label="Template"
                value={formik.values.template}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                fullWidth
                select
              >
                {
                  templates ? templates.map((template) => (
                    <MenuItem key={template.id} id={template.id} value={template.id}>
                      {template.name}
                    </MenuItem>
                  )) : null
                }
              </TextField>
              {formik.touched.template && formik.errors.template ? (
                <Box sx={error}>{formik.errors.template}</Box>
              ) : null}
            </Box>

            <Button
              type="submit"
              variant="contained"
            >
              Create
            </Button>
          </FormControl>
        </form>
      )}
    </Formik>
  );
};

export default TournamentForm;
