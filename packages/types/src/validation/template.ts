import * as Yup from 'yup';
import {
  TemplateEventAttributes,
  TemplateEventCreationAttributes,
  templateEventCreationSchema,
} from './templateEvent';

interface TemplateAttributes {
  id: string;
  name: string;
  templateEvents?: TemplateEventAttributes[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TemplateCreationAttributes
  extends Omit<TemplateAttributes, 'id' | 'templateEvents'> {
  templateEvents?: TemplateEventCreationAttributes[];
}

const templateCreationSchema: Yup.SchemaOf<TemplateCreationAttributes> =
  Yup.object({
    name: Yup.string().max(100).required(),
    templateEvents: Yup.array().of(templateEventCreationSchema).optional(),
  });

// template events must be updated individually to properly create/delete

interface TemplateUpdateAttributes extends Partial<TemplateAttributes> {
  id: string;
}

const templateUpdateSchema: Yup.SchemaOf<TemplateUpdateAttributes> = Yup.object(
  {
    id: Yup.string().required(),
    name: templateCreationSchema.fields.name.optional(),
    templateEvents: templateCreationSchema.fields.templateEvents.optional(),
  },
);

export {templateCreationSchema, templateUpdateSchema};
export type {
  TemplateAttributes,
  TemplateCreationAttributes,
  TemplateUpdateAttributes,
};
