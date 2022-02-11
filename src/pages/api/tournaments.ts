import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
// eslint-disable-next-line no-unused-vars
import sequelize from '../../models/sequelize';
import {
  TournamentEvent, Tournament, Template, TemplateEvent,
} from '../../models';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });
  if (session) {
    if (req.method === 'POST') {
      const tournament = await Tournament.create({ userId: session.id, ...req.body });
      const template = await Template.findOne({ where: { id: req.body.template }, include: [{ model: TemplateEvent, as: 'templateEvents' }] });
      template.templateEvents.forEach(async (templateEvent) => {
        await tournament.createTournamentEvent({ name: templateEvent.name, minutes: templateEvent.minutes, link: '' });
      });
      res.status(200).json(tournament);
    } else if (req.method === 'GET') {
      const tournaments = await Tournament.findAll({ include: [{ model: TournamentEvent, as: 'tournamentEvents' }] });
      res.status(200).json(tournaments);
    }
  } else {
    res.status(401).end();
  }
}
