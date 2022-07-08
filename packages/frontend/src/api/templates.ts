import {
  TemplateCreationAttributes,
  TemplateUpdateAttributes,
} from 'scioly-bot-types';

const getTemplates = () => {
  return fetch(`/api/templates`);
};

const getTemplate = (templateId: string) => {
  return fetch(`/api/templates/${templateId}`);
};

const createTemplate = (template: TemplateCreationAttributes) => {
  return fetch(`/api/templates`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(template),
  });
};

const updateTemplate = (
  templateId: string,
  template: TemplateUpdateAttributes,
) => {
  return fetch(`/api/templates/${templateId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(template),
  });
};

const deleteTemplate = (templateId: string) => {
  return fetch(`/api/templates/${templateId}`, {
    method: 'DELETE',
  });
};

export {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};
