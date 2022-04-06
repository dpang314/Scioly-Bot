import {
  FormControl, Button, TextField, Typography,
} from '@mui/material';
import { FieldArray, Formik } from 'formik';
import React, { FunctionComponent } from 'react';
import * as Yup from 'yup';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useSWR, { useSWRConfig } from 'swr';
import { useSession } from 'next-auth/react';
import { Tournament } from '../../../../models';
import ErrorMessage from '../../components/ErrorMessage';

import { urlRegex } from '../../../../util';

type FormProps = {
  id: string,
  tournamentName: string,
}

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

const TournamentEventsForm: FunctionComponent<FormProps> = ({ id, tournamentName }) => {
  const errorStyle = {
    color: 'red',
  };

  const { mutate } = useSWRConfig();
  const { data: session, status } = useSession({
    required: true,
  });

  const { data, error } = useSWR<Tournament>(`/api/tournaments/${id}/`, fetcher);

  if (error) return <div>Failed to load</div>;
  if (status === 'loading' || !session || !data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {tournamentName}
        {' '}
        Events
      </Typography>
      <Formik
        initialValues={{ tournamentEvents: data.tournamentEvents, removed: [] }}
        validationSchema={
          Yup.object({
            tournamentEvents: Yup.array()
              .of(
                Yup.object().shape({
                  name: Yup.string()
                    .max(100, 'Must be 100 characters or less')
                    .required('Required'),
                  minutes: Yup.number()
                    .min(0, 'Test can\'t have a negative time limit')
                    .max(1440, 'Test must be under 1440 minutes long')
                    .required('Required'),
                  link: Yup.string()
                    .max(200, 'Must be 200 characters or less')
                    .matches(urlRegex, 'Must be a valid URL'),
                }),
              )
              .required('Must have events')
              .min(1, 'Must have at least 1 event'),
          })
        }
        onSubmit={async (values, { setSubmitting }) => {
          await fetch(
            `/api/tournaments/${id}/`,
            {
              body: JSON.stringify(values),
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'PUT',
            },
          );
          mutate(`/api/tournaments/${id}/`);
          setSubmitting(false);
        }}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <FormControl fullWidth margin="normal">
              <FieldArray
                name="tournamentEvents"
                render={(arrayHelpers) => (
                  <div style={{ width: 'auto' }}>
                    {formik.values.tournamentEvents && formik.values.tournamentEvents.length > 0
                      ? (
                        formik.values.tournamentEvents.map((event, index) => (
                          <div
                            key={event.id}
                            style={{
                              marginBottom: '10px', display: 'flex', flexDirection: 'row', alignContent: 'center',
                            }}
                          >
                            <div style={{ flex: 2, marginRight: '10px' }}>
                              <TextField label="Name" {...formik.getFieldProps(`tournamentEvents[${index}].name`)} fullWidth />
                              <ErrorMessage name={`tournamentEvents[${index}].name`} />
                            </div>
                            <div style={{ flex: 2, marginRight: '10px' }}>
                              <TextField {...formik.getFieldProps(`tournamentEvents[${index}].minutes`)} label="Minutes" fullWidth />
                              <ErrorMessage name={`tournamentEvents[${index}].minutes`} />
                            </div>
                            <div style={{ flex: 7 }}>
                              <TextField {...formik.getFieldProps(`tournamentEvents[${index}].link`)} label="Link" fullWidth />
                              <ErrorMessage name={`tournamentEvents[${index}].link`} />
                            </div>
                            <Button onClick={() => {
                              arrayHelpers.remove(index);
                              if (event.id) {
                                formik.values.removed.push(event.id);
                              }
                            }}
                            >
                              <RemoveCircleOutlineIcon />
                            </Button>
                            <Button onClick={() => arrayHelpers.insert(index + 1, { name: '', minutes: '', link: '' })}>
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
                    typeof formik.errors.tournamentEvents === 'string' ? <div style={{ ...errorStyle, marginBottom: '10px' }}>{formik.errors.tournamentEvents}</div> : <div style={{ ...errorStyle, marginBottom: '10px' }} />
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
    </>
  );
};

export default TournamentEventsForm;
