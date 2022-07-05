import {Router} from 'express';
import {TemplateEvent, Tournament, TournamentEvent} from '../../models';
import {
  TournamentCreationAttributes,
  tournamentSchema,
} from '../../models/TournamentModel';

const tournamentsRouter = Router();

tournamentsRouter.get('/', async (req, res) => {
  const tournaments = await req.user?.getTournaments({
    include: [{model: TournamentEvent, as: 'tournamentEvents'}],
  });
  // Return tournaments or empty
  res.status(200).json(tournaments ? tournaments : []);
});

tournamentsRouter.get('/:id', async (req, res) => {
  const {id} = req.params;
  const tournament = await req.user?.getTournaments({
    where: {id},
    include: [{model: TournamentEvent, as: 'tournamentEvents'}],
  });
  if (!tournament || tournament.length == 0) res.status(404).send('Not found');
  else res.status(200).json(tournament[0]);
});

tournamentsRouter.post('/', async (req, res) => {
  const tournament: TournamentCreationAttributes = {
    name: req.body.name,
    active: req.body.active,
    submission: req.body.submission,
    tournamentEvents: req.body.tournamentEvents,
  };
  let validatedTournament;
  try {
    validatedTournament = await tournamentSchema.validate(tournament);
  } catch (e) {
    return res.status(400).send('Invalid tournament');
  }
  const tournamentModel = await req.user?.createTournament(validatedTournament);

  if (req.body.template) {
    const template = await req.user?.getTemplates({
      where: {id: req.body.template},
      limit: 1,
      include: [{model: TemplateEvent, as: 'templateEvents'}],
    });
    if (template && template[0].templateEvents) {
      template[0].templateEvents.forEach(async (templateEvent) => {
        await tournamentModel?.createTournamentEvent({
          name: templateEvent.name,
          minutes: templateEvent.minutes,
          link: '',
        });
      });
    }
    const updatedTournament = await Tournament.findByPk(tournamentModel?.id);
    return res.status(200).json(updatedTournament);
  }
  return res.status(200).json(tournamentModel);
});

tournamentsRouter.put('/:id', async (req, res) => {
  const {id} = req.params;
  const newEvents: TournamentEvent[] = [];
  if (req.body.tournamentEvents) {
    req.body.tournamentEvents.forEach(async (event) => {
      const [newEvent] = await TournamentEvent.upsert({
        ...event,
        tournamentId: id,
      });
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
    await Tournament.update({active: req.body.active}, {where: {id}});
  }
  res.status(200).json({tournamentEvents: newEvents, active: req.body.active});
});

tournamentsRouter.delete('/:id', async (req, res) => {
  const {id} = req.params;
  const tournament = await req.user?.getTournaments({
    where: {id},
    include: [{model: TournamentEvent, as: 'tournamentEvents'}],
  });
  if (tournament && tournament[0]) {
    tournament[0].tournamentEvents?.forEach(async (tournamentEvent) => {
      await tournamentEvent.destroy();
    })
    const deletedTournament = await tournament[0].destroy();
    return res.status(200).json(deletedTournament);
  }
  return res.status(404).json('Not found');
})

export default tournamentsRouter;
