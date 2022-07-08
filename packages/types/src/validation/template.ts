import * as Yup from 'yup';
import {TemplateCreationAttributes, TemplateUpdateAttributes} from '../types';
import {templateEventCreationSchema} from './templateEvent';

const templateCreationSchema: Yup.SchemaOf<TemplateCreationAttributes> =
  Yup.object({
    name: Yup.string().max(100).required(),
    templateEvents: Yup.array().of(templateEventCreationSchema).optional(),
  });

const templateUpdateSchema: Yup.SchemaOf<TemplateUpdateAttributes> = Yup.object(
  {
    id: Yup.string().required(),
    name: templateCreationSchema.fields.name.optional(),
    templateEvents: templateCreationSchema.fields.templateEvents.optional(),
  },
);

export {templateCreationSchema, templateUpdateSchema};
