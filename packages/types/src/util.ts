import * as Yup from 'yup';

const nameSchema = Yup.string()
  .typeError('Must be a string')
  .max(100, 'Must be 100 characters or less');

// could add a transformation to automatically add https:// if the link
// doesn't start with http:// or https:// as it is very likely that the link
// should have https://. However, this could lead to a silent failure if
// the link was actually supposed to have http://
const urlSchema = Yup.string()
  .trim()
  .typeError('Must be a string')
  .matches(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
    'Must be a full URL with http:// or https://',
  );

const minutesSchema = Yup.number()
  .typeError('Must be a number')
  .min(1, 'Must be at least 1 minute long')
  .max(1440, 'Must be 1440 minutes or less');

export {urlSchema, nameSchema, minutesSchema};
