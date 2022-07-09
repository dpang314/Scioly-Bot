import {
  TemplateEventAttributes,
  TemplateEventCreationAttributes,
} from 'scioly-bot-types';

const validTemplateEvent: TemplateEventCreationAttributes = {
  name: 'test event',
  minutes: 1000,
};

const incompleteTemplateEvent = {
  name: 'incomplete template event',
};

const invalidTemplateEvent: TemplateEventCreationAttributes = {
  name: 'test event',
  minutes: 10000000000,
};

const validCompleteTemplateEvent: TemplateEventAttributes = {
  ...validTemplateEvent,
  id: 'valid template event with all attributes',
};

export {
  validTemplateEvent,
  incompleteTemplateEvent,
  invalidTemplateEvent,
  validCompleteTemplateEvent,
};
