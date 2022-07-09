import {TemplateEventCreationAttributes} from 'scioly-bot-types';

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

export {validTemplateEvent, incompleteTemplateEvent, invalidTemplateEvent};
