import {FormControl, Box, TextField, Button} from '@mui/material';
import {Formik, FieldArray} from 'formik';
import {FunctionComponent} from 'react';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ErrorMessage from '../../components/ErrorMessage';
import {
  TemplateAttributes,
  TemplateCreationAttributes,
  templateCreationSchema,
} from 'scioly-bot-types';

export type FormProps = {
  template?: TemplateAttributes;
  setOpen: (open: boolean) => void;
  addStateTemplate: (template: TemplateCreationAttributes) => void;
  updateStateTemplate: (template: TemplateAttributes) => void;
};

const TemplateForm: FunctionComponent<FormProps> = ({
  setOpen,
  template,
  addStateTemplate,
  updateStateTemplate,
}) => (
  <Formik
    initialValues={{
      name: template ? template.name : '',
      templateEvents:
        template && template?.templateEvents ? template.templateEvents : [],
    }}
    validationSchema={templateCreationSchema}
    onSubmit={async (values, {setSubmitting}) => {
      if (template) {
        await updateStateTemplate({
          id: template.id,
          ...values,
        });
      } else {
        await addStateTemplate(values);
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
              label="Template Name"
              variant="outlined"
              sx={{display: 'block'}}
              fullWidth
              {...formik.getFieldProps('name')}
            />
            <ErrorMessage name="name" />
          </Box>
          <FieldArray
            name="templateEvents"
            render={(arrayHelpers) => (
              <div style={{width: 'auto'}}>
                {formik.values.templateEvents &&
                formik.values.templateEvents.length > 0 ? (
                  formik.values.templateEvents.map((event, index) => (
                    <div
                      key={event.id ? event.id : index}
                      style={{
                        marginBottom: '10px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignContent: 'center',
                      }}>
                      <div style={{flexGrow: 1, marginRight: '10px'}}>
                        <TextField
                          label="Name"
                          {...formik.getFieldProps(
                            `templateEvents[${index}].name`,
                          )}
                          fullWidth
                        />
                        <ErrorMessage name={`templateEvents[${index}].name`} />
                      </div>
                      <div>
                        <TextField
                          {...formik.getFieldProps(
                            `templateEvents[${index}].minutes`,
                          )}
                          label="Minutes"
                          type="number"
                        />
                        <ErrorMessage
                          name={`templateEvents[${index}].minutes`}
                        />
                      </div>
                      <Button
                        className="remove-event"
                        onClick={() => {
                          arrayHelpers.remove(index);
                        }}>
                        <RemoveCircleOutlineIcon />
                      </Button>
                      <Button
                        className="add-event"
                        onClick={() =>
                          arrayHelpers.insert(index + 1, {
                            name: '',
                            minutes: '',
                          })
                        }>
                        <AddCircleIcon />
                      </Button>
                    </div>
                  ))
                ) : (
                  <Button
                    className="add-event"
                    variant="outlined"
                    fullWidth
                    onClick={() => arrayHelpers.push({name: '', minutes: ''})}>
                    Add event
                  </Button>
                )}
              </div>
            )}
          />
          {typeof formik.errors.templateEvents === 'string' ? (
            <div style={{color: 'red', marginBottom: '10px'}}>
              {formik.errors.templateEvents}
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

export default TemplateForm;
