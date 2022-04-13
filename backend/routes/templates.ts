import { Router } from 'express';
import { Template, TemplateEvent } from 'common/models';

const templatesRouter = Router();

templatesRouter.post('/', async (req, res) => {
  const template = await Template.create(req.body, {
    include: [{
      model: TemplateEvent,
      as: 'templateEvents',
    }],
  });
  res.status(200).json(template);
});

templatesRouter.get('/', async (req, res) => {
  const templates = await Template.findAll({ include: [{ model: TemplateEvent, as: 'templateEvents' }] });
  res.status(200).json(templates);
});

templatesRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (req.body.name) {
    await Template.update({ name: req.body.name }, { where: { id } });
  }
  const newEvents: Array<TemplateEvent> = [];
  if (req.body.templateEvents) {
    req.body.templateEvents.forEach(async (event) => {
      const [newEvent] = await TemplateEvent.upsert({ ...event, templateId: id });
      newEvents.push(newEvent);
    });
  }
  if (req.body.removed) {
    req.body.removed.forEach(async (remove) => {
      await TemplateEvent.destroy({
        where: {
          id: remove,
        },
      });
    });
  }
  res.status(200).json({
    name: req.body.name ? req.body.name : null,
    templateEvents: newEvents,
  });
});

templatesRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const tournaments = await Template.findOne({ where: { id }, include: [{ model: TemplateEvent, as: 'templateEvents' }] });
  res.status(200).json(tournaments);
});

export default templatesRouter;
