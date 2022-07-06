import {Router} from 'express';
import {TemplateEvent} from '../../models';
import { TemplateEventCreationAttributes, templateEventCreationSchema, TemplateEventUpdateAttributes } from '../../models/TemplateEventModel';
import {
  tournamentEventUpdateSchema,
} from '../../models/TournamentEventModel';

const templateEventsRouter = Router();

templateEventsRouter.get('/:templateId/events', async (req, res) => {
  const {templateId} = req.params;
  const templates = await req.user?.getTemplates({
    where: {id: templateId},
    include: [{model: TemplateEvent, as: 'templateEvents'}],
  });
  if (!templates || !templates[0]) return res.status(404).json('Not found');
  // Return template events or empty
  return res
    .status(200)
    .json(
      templates[0].templateEvents ? templates[0].templateEvents : [],
    );
});

templateEventsRouter.get(
  '/:templateId/events/:eventId',
  async (req, res) => {
    const {templateId, eventId} = req.params;
    const templates = await req.user?.getTemplates({
      where: {id: templateId},
      include: [{model: TemplateEvent, as: 'templateEvents'}],
    });
    if (!templates || !templates[0])
      return res.status(404).json('Not found');
    const templateEvent = await templates[0].getTemplateEvents({
      where: {
        id: eventId,
      },
    });
    if (!templateEvent || !templateEvent[0])
      return res.status(404).json('Not found');
    return res.status(200).json(templateEvent[0]);
  },
);

templateEventsRouter.post('/:templateId/events', async (req, res) => {
  const {templateId} = req.params;
  const templates = await req.user?.getTemplates({
    where: {id: templateId},
    include: [{model: TemplateEvent, as: 'templateEvents'}],
  });
  if (!templates || !templates[0]) return res.status(404).json('Not found');
  const templateEvent: TemplateEventCreationAttributes = {
    name: req.body.name,
    minutes: req.body.minutes,
  };
  let validatedTemplateEvent;
  try {
    validatedTemplateEvent = await templateEventCreationSchema.validate(
      templateEvent,
    );
  } catch (e) {
    return res.status(400).send('Invalid template event');
  }

  const templateEventModel = await templates[0].createTemplateEvent(
    validatedTemplateEvent,
  );
  return res.status(200).send(templateEventModel);
});

templateEventsRouter.patch(
  '/:templateId/events/:eventId',
  async (req, res) => {
    const {templateId, eventId} = req.params;
    const templates = await req.user?.getTemplates({
      where: {id: templateId},
      include: [{model: TemplateEvent, as: 'templateEvents'}],
    });
    if (!templates || !templates[0])
      return res.status(404).json('Not found');
    const templateEventAttributes: TemplateEventUpdateAttributes = {
      id: eventId,
      ...req.body,
    };
    let validatedTemplateEvent;
    try {
      validatedTemplateEvent = await tournamentEventUpdateSchema.validate(
        templateEventAttributes,
      );
    } catch (e) {
      return res.status(400).send('Invalid tournament');
    }
    const templateEvent = await templates[0].getTemplateEvents({
      where: {
        id: eventId,
      },
    });
    if (!templateEvent || !templateEvent[0])
      return res.status(404).json('Not found');
    const updatedModel = await templateEvent[0].update(
      validatedTemplateEvent,
    );
    return res.status(200).json(updatedModel);
  },
);

templateEventsRouter.delete(
  '/:templateId/events/:eventId',
  async (req, res) => {
    const {templateId, eventId} = req.params;
    const templates = await req.user?.getTemplates({
      where: {id: templateId},
      include: [{model: TemplateEvent, as: 'templateEvents'}],
    });
    if (!templates || !templates[0])
      return res.status(404).json('Not found');
    const templateEvent = await templates[0].getTemplateEvents({
      where: {
        id: eventId,
      },
    });
    if (!templateEvent || !templateEvent[0])
      return res.status(404).json('Not found');
    const deletedTemplate = await templateEvent[0].destroy();
    return res.status(200).json(deletedTemplate);
  },
);

export default templateEventsRouter;
