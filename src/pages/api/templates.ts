import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { TEST } from '../../util';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('../../models');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });
  if (session || TEST) {
    if (req.method === 'POST') {
      const template = await db.Template.create(req.body, {
        include: [{
          model: db.TemplateEvent,
          as: 'templateEvents',
        }],
      });
      res.status(200).json(template);
    } else if (req.method === 'GET') {
      const templates = await db.Template.findAll({ include: [{ model: db.TemplateEvent, as: 'templateEvents' }] });
      res.status(200).json(templates);
    }
  } else {
    res.status(401).end();
  }
}
