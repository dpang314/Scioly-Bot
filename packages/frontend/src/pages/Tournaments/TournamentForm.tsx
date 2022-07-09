import {
  FormControl,
  Box,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import {Formik, FieldArray} from 'formik';
import {FunctionComponent} from 'react';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ErrorMessage from '../../components/ErrorMessage';
import {
  TemplateAttributes,
  TournamentAttributes,
  TournamentCreationAttributes,
  tournamentCreationSchema,
} from 'scioly-bot-types';
import * as Yup from 'yup';

export type FormProps = {
  tournament?: TournamentAttributes;
  templates: TemplateAttributes[];
  setOpen: (open: boolean) => void;
  addStateTournament: (tournament: TournamentCreationAttributes) => void;
  updateStateTournament: (tournament: TournamentAttributes) => void;
};

const TournamentForm: FunctionComponent<FormProps> = ({
  setOpen,
  tournament,
  templates,
  addStateTournament,
  updateStateTournament,
}) => (
  <Formik
    initialValues={{
      name: tournament ? tournament.name : '',
      submission: tournament ? tournament.submission : '',
      template: '',
      tournamentEvents: tournament?.tournamentEvents
        ? tournament.tournamentEvents
        : [],
    }}
    validationSchema={Yup.object({
      name: tournamentCreationSchema.fields.name,
      submission: tournamentCreationSchema.fields.submission,
      tournamentEvents: tournamentCreationSchema.fields.tournamentEvents,
      template: Yup.number().optional(),
    })}
    onSubmit={async (values, {setSubmitting}) => {
      if (tournament) {
        updateStateTournament({
          id: tournament.id,
          active: tournament.active,
          ...values,
        });
      } else {
        addStateTournament({
          ...values,
          active: false,
        });
      }
      setSubmitting(false);
      setOpen(false);
    }}>
    {(formik) => (
      <form onSubmit={formik.handleSubmit}>
        <FormControl fullWidth margin="normal">
          <Box sx={{marginBottom: '10px'}}>
            <TextField
              id="name"
              label="Tournament Name"
              variant="outlined"
              sx={{display: 'block'}}
              fullWidth
              {...formik.getFieldProps('name')}
            />
            {formik.touched.name && formik.errors.name ? (
              <Box sx={{color: 'red'}}>{formik.errors.name}</Box>
            ) : null}
          </Box>

          <Box sx={{marginBottom: '10px'}}>
            <TextField
              id="submission"
              label="Submission Form Link  "
              variant="outlined"
              sx={{display: 'block'}}
              fullWidth
              {...formik.getFieldProps('submission')}
            />
            {formik.touched.submission && formik.errors.submission ? (
              <Box sx={{color: 'red'}}>{formik.errors.submission}</Box>
            ) : null}
          </Box>
          {tournament ? (
            <></>
          ) : (
            <>
              <Box sx={{marginBottom: '10px'}}>
                <TextField
                  name="template"
                  label="Template"
                  value={formik.values.template}
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    // formik.values.template doesn't seem to update until after onChange
                    // Running formik.handleChange first does not work either
                    if (parseInt(e.target.value) >= 0) {
                      const template = templates[parseInt(e.target.value)];
                      if (template.templateEvents) {
                        formik.setFieldValue(
                          'tournamentEvents',
                          template.templateEvents.map((templateEvent) => ({
                            ...templateEvent,
                            link: '',
                          })),
                          true,
                        );
                      } else {
                        formik.setFieldValue('tournamentEvents', [], true);
                      }
                    } else {
                      formik.setFieldValue('tournamentEvents', [], true);
                    }
                    formik.handleChange(e);
                  }}
                  fullWidth
                  select
                  defaultValue="">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {templates
                    ? templates.map((template, index) => (
                        <MenuItem
                          key={template.id}
                          id={template.id}
                          value={index}>
                          {template.name}
                        </MenuItem>
                      ))
                    : null}
                </TextField>
                {formik.touched.template && formik.errors.template ? (
                  <Box sx={{color: 'red'}}>{formik.errors.template}</Box>
                ) : null}
              </Box>
            </>
          )}

          <FieldArray
            name="tournamentEvents"
            render={(arrayHelpers) => (
              <div style={{width: 'auto'}}>
                {formik.values.tournamentEvents &&
                formik.values.tournamentEvents.length > 0 ? (
                  formik.values.tournamentEvents.map((event, index) => (
                    <div
                      key={event.id ? event.id : index}
                      style={{
                        marginBottom: '10px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignContent: 'center',
                      }}>
                      <div style={{flex: 2, marginRight: '10px'}}>
                        <TextField
                          label="Name"
                          {...formik.getFieldProps(
                            `tournamentEvents[${index}].name`,
                          )}
                          fullWidth
                        />
                        <ErrorMessage
                          name={`tournamentEvents[${index}].name`}
                        />
                      </div>
                      <div style={{flex: 2, marginRight: '10px'}}>
                        <TextField
                          {...formik.getFieldProps(
                            `tournamentEvents[${index}].minutes`,
                          )}
                          label="Minutes"
                          fullWidth
                        />
                        <ErrorMessage
                          name={`tournamentEvents[${index}].minutes`}
                        />
                      </div>
                      <div style={{flex: 7}}>
                        <TextField
                          {...formik.getFieldProps(
                            `tournamentEvents[${index}].link`,
                          )}
                          label="Link"
                          fullWidth
                        />
                        <ErrorMessage
                          name={`tournamentEvents[${index}].link`}
                        />
                      </div>
                      <Button
                        onClick={() => {
                          arrayHelpers.remove(index);
                        }}>
                        <RemoveCircleOutlineIcon />
                      </Button>
                      <Button
                        onClick={() =>
                          arrayHelpers.insert(index + 1, {
                            name: '',
                            minutes: '',
                            link: '',
                          })
                        }>
                        <AddCircleIcon />
                      </Button>
                    </div>
                  ))
                ) : (
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => arrayHelpers.push({name: '', minutes: ''})}>
                    Add event
                  </Button>
                )}
              </div>
            )}
          />
          {typeof formik.errors.tournamentEvents === 'string' ? (
            <div style={{color: 'red', marginBottom: '10px'}}>
              {formik.errors.tournamentEvents}
            </div>
          ) : (
            <div style={{color: 'red', marginBottom: '10px'}} />
          )}

          <Button type="submit" variant="contained">
            Save
          </Button>
        </FormControl>
      </form>
    )}
  </Formik>
);

export default TournamentForm;
