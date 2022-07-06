import {Router} from 'express';
import {TemplateEvent} from '../../models';
import {
  TemplateCreationAttributes,
  templateCreationSchema,
  TemplateUpdateAttributes,
  templateUpdateSchema,
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
    validatedTemplate = await templateCreationSchema.validate(template);
  } catch (e) {
    return res.status(400).send('Invalid template');
  }
  const templateModel = await req.user?.createTemplate(validatedTemplate, {
    include: [{model: TemplateEvent, as: 'templateEvents'}],
  });
  return res.status(200).json(templateModel);
});

templatesRouter.patch('/:id', async (req, res) => {
  const {id} = req.params;
  const templateModel = await req.user?.getTemplates({
    where: {
      id,
    }, include: [{model: TemplateEvent, as: 'templateEvents'}],
  });
  if (!templateModel || !templateModel[0]) return res.status(404).send('Not found');
  const template: TemplateUpdateAttributes = {
    id,
    ...req.body,
  };
  let validatedTemplate;
  try {
    validatedTemplate = await templateUpdateSchema.validate(template);
  } catch (e) {
    return res.status(400).send('Invalid template');
  }
  const updatedModel = await templateModel[0].update(validatedTemplate);
  return res.status(200).json(updatedModel);
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
