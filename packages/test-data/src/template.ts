import {TemplateAttributes, TemplateCreationAttributes} from 'scioly-bot-types';
import {validCompleteTemplateEvent} from './templateEvent';

const validTemplate: TemplateCreationAttributes = {
  name: 'test template',
  templateEvents: [
    {
      name: 'test event',
      minutes: 1000,
    },
  ],
};

const validTemplateWithoutEvents: TemplateCreationAttributes = {
  name: 'test template 2',
  templateEvents: [],
};

const validTemplate2: TemplateCreationAttributes = {
  name: 'test template 2',
  templateEvents: [
    {
      name: 'another test event',
      minutes: 10,
    },
  ],
};

const validOtherTemplate: TemplateCreationAttributes = {
  name: "some other template mock user doesn't have access to",
  templateEvents: [
    {
      name: 'test event',
      minutes: 1000,
    },
  ],
};

const incompleteTemplate = {
  not_a_key: 'hunter2',
};

const invalidTemplate: TemplateCreationAttributes = {
  // Exceeds maximum length
  name: 'a loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong name over 100 characters long',
};

const validCompleteTemplate: TemplateAttributes = {
  ...validTemplate,
  id: 'valid template with all attributes',
  templateEvents: [validCompleteTemplateEvent],
};

export {
  validTemplate,
  validTemplateWithoutEvents,
  validTemplate2,
  validOtherTemplate,
  incompleteTemplate,
  invalidTemplate,
  validCompleteTemplate,
};
