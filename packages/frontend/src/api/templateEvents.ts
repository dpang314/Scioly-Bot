import {
  TemplateEventCreationAttributes,
  TemplateEventUpdateAttributes,
} from 'scioly-bot-types';

const getTemplateEvents = async (templateId: string) => {
  return await fetch(`/api/templates/${templateId}/events`);
};

const getTemplateEvent = async (
  templateId: string,
  templateEventId: string,
) => {
  return await fetch(`/api/templates/${templateId}/events/${templateEventId}`);
};

const createTemplateEvent = async (
  templateId: string,
  templateEvent: TemplateEventCreationAttributes,
) => {
  return await fetch(`/api/templates/${templateId}/events`, {
    method: 'POST',
    body: JSON.stringify(templateEvent),
  });
};

const updateTemplateEvent = async (
  templateId: string,
  templateEvent: TemplateEventUpdateAttributes,
) => {
  return await fetch(`/api/templates/${templateId}/events`, {
    method: 'PATCH',
    body: JSON.stringify(templateEvent),
  });
};

const deleteTemplateEvent = async (
  templateId: string,
  templateEventId: string,
) => {
  return await fetch(`/api/templates/${templateId}/events/${templateEventId}`, {
    method: 'DELETE',
  });
};

export {
  getTemplateEvents,
  getTemplateEvent,
  createTemplateEvent,
  updateTemplateEvent,
  deleteTemplateEvent,
};
