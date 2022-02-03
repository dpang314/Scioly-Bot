import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/react"
import { Tournament, TournamentCreationAttributes } from '../../models';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const session = await getSession({ req });
    if (session) {
      // TODO create test templates associated with tournament template
      const tournamentValues: TournamentCreationAttributes = { user_id: session.id, ...req.body }
      const tournament = await Tournament.create(tournamentValues);
      res.status(200).json(tournament);
    } else {
      res.status(401).json({"error": "unauthorized"});
    }
  } else if (req.method === 'GET') {
    const tournaments = await Tournament.findAll({});
    res.status(200).json(tournaments);
  }
}
