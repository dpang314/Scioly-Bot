import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import {
  Tournament, TournamentEvent,
} from '../../../models';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });
  const { tournamentId } = req.query;
  if (session) {
    if (req.method === 'PUT') {
      const newEvents = [];
      if (req.body.tournamentEvents) {
        req.body.tournamentEvents.forEach(async (event) => {
          const [newEvent] = await TournamentEvent.upsert({ ...event, tournamentId });
          newEvents.push(newEvent);
        });
      }
      if (req.body.removed) {
        req.body.removed.forEach(async (remove) => {
          await TournamentEvent.destroy({
            where: {
              id: remove,
            },
          });
        });
      }
      if (req.body.active !== null) {
        await Tournament.update(
          { active: req.body.active },
          { where: { id: tournamentId } },
        );
      }
      res.status(200).json({ tournamentEvents: newEvents, active: req.body.active });
    } else if (req.method === 'GET') {
      const tournaments = await Tournament.findOne({ where: { id: tournamentId }, include: [{ model: TournamentEvent, as: 'tournamentEvents' }] });
      res.status(200).json(tournaments);
    }
  } else {
    res.status(401).end();
  }
}
