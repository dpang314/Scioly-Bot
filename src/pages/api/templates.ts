import type { NextApiRequest, NextApiResponse } from 'next'
import { Template } from '../../models';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const template = await Template.create(req.body);
    res.status(200).json(template);
  } else if (req.method === 'GET') {
    const templates = await Template.findAll({});
    res.status(200).json(templates);
  }
}
