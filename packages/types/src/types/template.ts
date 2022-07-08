import {TemplateEventAttributes, TemplateEventCreationAttributes} from '.';

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

interface TemplateUpdateAttributes extends Partial<TemplateAttributes> {
  id: string;
}

export type {
  TemplateAttributes,
  TemplateCreationAttributes,
  TemplateUpdateAttributes,
};
