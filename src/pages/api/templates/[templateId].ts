import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import {
  Template,
  TemplateEvent,
} from '../../../models';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });
  const { templateId } = req.query;
  if (session) {
    if (req.method === 'PUT') {
      if (req.body.name) {
        await Template.update({ name: req.body.name }, { where: { id: templateId } });
      }
      const newEvents = [];
      if (req.body.templateEvents) {
        req.body.templateEvents.forEach(async (event) => {
          const [newEvent] = await TemplateEvent.upsert({ ...event, templateId });
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
    } else if (req.method === 'GET') {
      const tournaments = await Template.findOne({ where: { id: templateId }, include: [{ model: TemplateEvent, as: 'templateEvents' }] });
      res.status(200).json(tournaments);
    }
  } else {
    res.status(401).end();
  }
}
