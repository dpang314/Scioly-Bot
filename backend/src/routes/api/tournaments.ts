import {Router} from 'express';
import {
  Template,
  TemplateEvent,
  Tournament,
  TournamentEvent,
} from '../../models';
import {
  TournamentCreationAttributes,
  tournamentSchema,
} from '../../models/TournamentModel';

const tournamentsRouter = Router();

tournamentsRouter.get('/', async (req, res) => {
  const tournaments = await Tournament.findAll({
    where: {userId: req.user?.id},
    include: [{model: TournamentEvent, as: 'tournamentEvents'}],
  });
  res.status(200).json(tournaments);
});

tournamentsRouter.post('/', async (req, res) => {
  if (!req.user) return res.status(401).send('Unauthorized');
  // user is guaranteed to exist because of middleware
  const tournament: TournamentCreationAttributes = {
    name: req.body.name,
    active: req.body.active,
    submission: req.body.submission,
    tournamentEvents: req.body.tournamentEvents,
    userId: req.user?.id,
  };
  let validatedTournament;
  try {
    validatedTournament = await tournamentSchema.validate(tournament);
  } catch (e) {
    return res.status(400).send('Invalid tournament');
  }
  const tournamentModel = await Tournament.create(validatedTournament);

  if (req.body.template) {
    const template = await Template.findOne({
      where: {id: req.body.template},
      include: [{model: TemplateEvent, as: 'templateEvents'}],
    });
    if (template?.templateEvents) {
      template.templateEvents.forEach(async (templateEvent) => {
        await tournamentModel.createTournamentEvent({
          name: templateEvent.name,
          minutes: templateEvent.minutes,
          link: '',
        });
      });
    }
    const updatedTournament = await Tournament.findByPk(tournamentModel.id);
    return res.status(200).json(updatedTournament);
  }
  return res.status(200).json(tournamentModel);
});

tournamentsRouter.get('/:id', async (req, res) => {
  const {id} = req.params;
  const tournament = await Tournament.findOne({
    where: {id},
    include: [{model: TournamentEvent, as: 'tournamentEvents'}],
  });
  if (!tournament) res.status(404).send('Not found');
  else if (tournament.userId != req.user?.id)
    res.status(401).send('Unauthorized');
  else res.status(200).json(tournament);
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

export default tournamentsRouter;
