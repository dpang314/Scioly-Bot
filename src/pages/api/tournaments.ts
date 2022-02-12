import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('../../models');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });
  if (session) {
    if (req.method === 'POST') {
      const tournament = await db.Tournament.create({ userId: session.id, ...req.body });
      const template = await db.Template.findOne({ where: { id: req.body.template }, include: [{ model: db.TemplateEvent, as: 'templateEvents' }] });
      template.templateEvents.forEach(async (templateEvent) => {
        await tournament.createTournamentEvent({ name: templateEvent.name, minutes: templateEvent.minutes, link: '' });
      });
      res.status(200).json(tournament);
    } else if (req.method === 'GET') {
      const tournaments = await db.Tournament.findAll({ include: [{ model: db.TournamentEvent, as: 'tournamentEvents' }] });
      res.status(200).json(tournaments);
    }
  } else {
    res.status(401).end();
  }
}
