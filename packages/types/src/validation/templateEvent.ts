import * as Yup from 'yup';
import {
  TemplateEventCreationAttributes,
  TemplateEventUpdateAttributes,
} from '../types';
import {minutesSchema, nameSchema} from '../util';

const templateEventCreationSchema: Yup.SchemaOf<TemplateEventCreationAttributes> =
  Yup.object({
    name: nameSchema.required('Required'),
    minutes: minutesSchema.required('Required'),
  });

const templateEventUpdateSchema: Yup.SchemaOf<TemplateEventUpdateAttributes> =
  Yup.object({
    name: templateEventCreationSchema.fields.name.optional(),
    minutes: templateEventCreationSchema.fields.minutes.optional(),
    id: Yup.string().required(),
  });

export {templateEventCreationSchema, templateEventUpdateSchema};
