import {Router} from 'express';
import {TemplateEvent} from '../../models';
import {
  TemplateCreationAttributes,
  templateSchema,
} from '../../models/TemplateModel';

const templatesRouter = Router();

templatesRouter.get('/', async (req, res) => {
  const templates = await req.user?.getTemplates({
    include: [{model: TemplateEvent, as: 'templateEvents'}],
  });
  // avoids returning undefined
  res.status(200).json(templates ? templates : []);
});

templatesRouter.get('/:id', async (req, res) => {
  const {id} = req.params;
  const template = await req.user?.getTemplates({
    where: {id},
    include: [{model: TemplateEvent, as: 'templateEvents'}],
  });
  if (!template || template.length == 0) res.status(404).send('Not found');
  else res.status(200).json(template[0]);
});

templatesRouter.post('/', async (req, res) => {
  const template: TemplateCreationAttributes = {
    name: req.body.name,
    templateEvents: req.body.templateEvents,
  };
  let validatedTemplate;
  try {
    validatedTemplate = await templateSchema.validate(template);
  } catch (e) {
    return res.status(400).send('Invalid template');
  }
  const templateModel = await req.user?.createTemplate(validatedTemplate);
  return res.status(200).json(templateModel);
});

templatesRouter.put('/:id', async (req, res) => {
  const {id} = req.params;
  // template events need to be manually created/updated/deleted
  const template: TemplateCreationAttributes = {
    name: req.body.name,
  };
  const oldTemplate = await req.user?.getTemplates({
    where: {id},
    include: [{model: TemplateEvent, as: 'templateEvents'}],
  });
  if (!oldTemplate || !oldTemplate[0]) return res.status(404).send('Not found');
  try {
    // still need to validate tournament events
    await templateSchema.validate({
      ...template,
      templateEvents: req.body.templateEvents,
    });
  } catch (e) {
    return res.status(400).send('Invalid tournament');
  }
  await oldTemplate[0].update(template);
  if (oldTemplate[0].templateEvents) {
    oldTemplate[0].templateEvents.forEach(async (event) => {
      if (
        !req.body.templateEvents ||
        req.body.templateEvents.findIndex((e) => e.id === event.id) == -1
      ) {
        await event.destroy();
      }
    });
  }
  if (req.body.templateEvents) {
    req.body.templateEvents.forEach(async (event) => {
      await TemplateEvent.upsert({
        ...event,
        templateId: id,
      });
    });
  }
  const updatedTemplate = await req.user?.getTemplates({
    where: {id},
    include: [{model: TemplateEvent, as: 'templateEvents'}],
  });

  if (updatedTemplate && updatedTemplate[0]) {
    return res.status(200).json(updatedTemplate[0]);
  }
  return res.status(404).send('Not found');
});

templatesRouter.delete('/:id', async (req, res) => {
  const {id} = req.params;
  const template = await req.user?.getTemplates({
    where: {id},
    include: [{model: TemplateEvent, as: 'templateEvents'}],
  });
  if (template && template[0]) {
    template[0].templateEvents?.forEach(async (tournamentEvent) => {
      await tournamentEvent.destroy();
    });
    const deletedTemplate = await template[0].destroy();
    return res.status(200).json(deletedTemplate);
  }
  return res.status(404).json('Not found');
});

export default templatesRouter;
