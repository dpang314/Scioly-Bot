interface TemplateEventAttributes {
  id: string;
  name: string;
  minutes: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TemplateEventCreationAttributes
  extends Omit<TemplateEventAttributes, 'id'> {}

interface TemplateEventUpdateAttributes
  extends Partial<TemplateEventAttributes> {
  id: string;
}

export type {
  TemplateEventAttributes,
  TemplateEventCreationAttributes,
  TemplateEventUpdateAttributes,
};
