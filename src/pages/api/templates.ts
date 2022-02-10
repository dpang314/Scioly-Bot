import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Template, TemplateEvent } from '../../models';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });
  if (session) {
    if (req.method === 'POST') {
      const template = await Template.create(req.body, {
        include: [{
          model: TemplateEvent,
          as: 'templateEvents',
        }],
      });
      res.status(200).json(template);
    } else if (req.method === 'GET') {
      const templates = await Template.findAll({ include: [{ model: TemplateEvent, as: 'templateEvents' }] });
      res.status(200).json(templates);
    }
  } else {
    res.status(401).end();
  }
}
