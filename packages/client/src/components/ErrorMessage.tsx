import {Box} from '@mui/material';
import {useField} from 'formik';
import {FunctionComponent} from 'react';

const errorStyle = {
  color: 'red',
  marginTop: '5px',
};

type ErrorMessageProp = {name: string};
const ErrorMessage: FunctionComponent<ErrorMessageProp> = ({name}) => {
  const [, meta] = useField(name);
  return meta.touched && meta.error ? (
    <Box sx={errorStyle}>{meta.error}</Box>
  ) : null;
};

export default ErrorMessage;
