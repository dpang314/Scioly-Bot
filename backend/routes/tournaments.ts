import { Router } from 'express';
import {
  Tournament, TournamentEvent,
} from 'backend/models';

const tournamentsRouter = Router();

tournamentsRouter.get('/', async (req, res) => {
  const tournaments = await Tournament.findAll({ include: [{ model: TournamentEvent, as: 'tournamentEvents' }] });
  res.status(200).json(tournaments);
});

// tournamentsRouter.post('/', async (req, res) => {
//   // TODO update session id after implementing passportjs
//   const tournament = await Tournament.create({ userId: session.id, ...req.body });
//   const template = await Template.findOne({ where: { id: req.body.template }, include: [{ model: TemplateEvent, as: 'templateEvents' }] });
//   template.templateEvents.forEach(async (templateEvent) => {
//     await tournament.createTournamentEvent({ name: templateEvent.name, minutes: templateEvent.minutes, link: '' });
//   });
//   res.status(200).json(tournament);
// });

tournamentsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const tournaments = await Tournament.findOne({ where: { id }, include: [{ model: TournamentEvent, as: 'tournamentEvents' }] });
  res.status(200).json(tournaments);
});

tournamentsRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const newEvents = [];
  if (req.body.tournamentEvents) {
    req.body.tournamentEvents.forEach(async (event) => {
      const [newEvent] = await TournamentEvent.upsert({ ...event, tournamentId: id });
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
      { where: { id } },
    );
  }
  res.status(200).json({ tournamentEvents: newEvents, active: req.body.active });
});

export default tournamentsRouter;
