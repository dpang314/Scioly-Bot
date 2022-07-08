import * as Yup from 'yup';

const nameSchema = Yup.string()
  .typeError('Must be a string')
  .max(100, 'Must be 100 characters or less');

const urlSchema = Yup.string()
  .typeError('Must be a string')
  .matches(
    /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
    'Must be a valid URL',
  );

const minutesSchema = Yup.number()
  .typeError('Must be a number')
  .min(1, 'Must be at least 1 minute long')
  .max(1440, 'Must be 1440 minutes or less');

export {urlSchema, nameSchema, minutesSchema};
