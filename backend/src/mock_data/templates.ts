import {TemplateCreationAttributes} from '../models/TemplateModel';

const validTemplate: TemplateCreationAttributes = {
  name: 'test template',
  templateEvents: [
    {
      name: 'test event',
      minutes: 1000,
    },
  ],
};

const validTemplate2: TemplateCreationAttributes = {
  name: 'test tournament 2',
  templateEvents: [
    {
      name: 'another test event',
      minutes: 10,
    },
  ],
};

const validOtherTemplate: TemplateCreationAttributes = {
  name: "some other tournament mock user doesn't have access to",
  templateEvents: [],
};

const incompleteTemplate = {
  not_a_key: 'hunter2',
};

const invalidTemplate: TemplateCreationAttributes = {
  // Exceeds maximum length
  name: 'a loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong name over 100 characters long',
};

export {
  validTemplate,
  validTemplate2,
  validOtherTemplate,
  incompleteTemplate,
  invalidTemplate,
};
