import * as Yup from 'yup';

interface TemplateEventAttributes {
  id: string;
  name: string;
  minutes: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TemplateEventCreationAttributes
  extends Omit<TemplateEventAttributes, 'id'> {}

const templateEventCreationSchema: Yup.SchemaOf<TemplateEventCreationAttributes> =
  Yup.object({
    name: Yup.string()
      .max(100, 'Must be 100 characters or less')
      .required('Required'),
    minutes: Yup.number()
      .min(0, "Test can't have a negative time limit")
      .max(1440, 'Test must be under 1440 minutes long')
      .required('Required'),
  });

interface TemplateEventUpdateAttributes
  extends Partial<TemplateEventAttributes> {
  id: string;
}

const templateEventUpdateSchema: Yup.SchemaOf<TemplateEventUpdateAttributes> =
  Yup.object({
    name: templateEventCreationSchema.fields.name.optional(),
    minutes: templateEventCreationSchema.fields.minutes.optional(),
    id: Yup.string().required(),
  });

export {templateEventCreationSchema, templateEventUpdateSchema};
export type {
  TemplateEventAttributes,
  TemplateEventCreationAttributes,
  TemplateEventUpdateAttributes,
};
