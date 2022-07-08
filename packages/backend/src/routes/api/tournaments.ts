import {Router} from 'express';
import { TournamentEvent, Template, TemplateEvent, Tournament } from 'scioly-bot-models';
import { TournamentCreationAttributes, tournamentCreationSchema, tournamentEventCreationSchema, TournamentUpdateAttributes, tournamentUpdateSchema } from 'scioly-bot-types';

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
    validatedTournament = await tournamentCreationSchema.validate(tournament);
  } catch (e) {
    return res.status(400).send('Invalid tournament');
  }

  let template: Template[] | undefined;
  if (req.body.template) {
    template = await req.user?.getTemplates({
      where: {id: req.body.template},
      limit: 1,
      include: [{model: TemplateEvent, as: 'templateEvents'}],
    });
    if (!template || !template[0])
      return res.status(404).send('Template not found');
  }
  const tournamentModel = await req.user?.createTournament(
    validatedTournament,
    {
      include: [{model: TournamentEvent, as: 'tournamentEvents'}],
    },
  );

  if (template && template[0].templateEvents) {
    template[0].templateEvents.forEach(async (templateEvent) => {
      await tournamentModel?.createTournamentEvent({
        name: templateEvent.name,
        minutes: templateEvent.minutes,
        link: '',
      });
    });
    const updatedTournament = await Tournament.findByPk(tournamentModel?.id, {
      include: [{model: TournamentEvent, as: 'tournamentEvents'}],
    });
    return res.status(200).json(updatedTournament);
  }

  return res.status(200).json(tournamentModel);
});

tournamentsRouter.patch('/:id', async (req, res) => {
  const {id} = req.params;
  const tournamentModel = await req.user?.getTournaments({
    where: {
      id,
    },
    include: [{model: TournamentEvent, as: 'tournamentEvents'}],
  });
  if (!tournamentModel || !tournamentModel[0])
    return res.status(404).send('Not found');
  const tournament: TournamentUpdateAttributes = {
    id,
    ...req.body,
  };
  let validatedTournament;
  try {
    validatedTournament = await tournamentUpdateSchema.validate(tournament);
  } catch (e) {
    return res.status(400).send('Invalid tournament');
  }
  const updatedModel = await tournamentModel[0].update(validatedTournament);
  return res.status(200).json(updatedModel);
});

tournamentsRouter.put('/:id', async (req, res) => {
  const {id} = req.params;
  const tournamentModel = await req.user?.getTournaments({
    where: {
      id,
    },
    include: [{model: TournamentEvent, as: 'tournamentEvents'}],
  });
  if (!tournamentModel || !tournamentModel[0])
    return res.status(404).send('Not found');
  const tournament: TournamentUpdateAttributes = {
    id,
    active: req.body.active,
    submission: req.body.submission,
    name: req.body.name,
  };
  let validatedTournament;
  try {
    validatedTournament = await tournamentUpdateSchema.validate(tournament);
    for (const event of req.body.tournamentEvents) {
      await tournamentEventCreationSchema.validate({
        name: event.name,
        minutes: event.minutes,
        link: event.link,
      });
    }
  } catch (e) {
    return res.status(400).send('Invalid tournament');
  }
  const updatedModel = await tournamentModel[0].update(validatedTournament, {
    include: [{model: TournamentEvent, as: 'tournamentEvents'}],
  });
  if (req.body.tournamentEvents) {
    if (updatedModel.tournamentEvents) {
      for await (const event of updatedModel.tournamentEvents) {
        if (
          req.body.tournamentEvents.findIndex(
            (newEvent) => newEvent.id === event.id,
          ) === -1
        ) {
          await event.destroy();
        }
      }
    }

    for await (const event of req.body.tournamentEvents) {
      if (!event.id) {
        await updatedModel.createTournamentEvent({
          name: event.name,
          minutes: event.minutes,
          link: event.link,
        });
      } else {
        const existingEvent = await updatedModel.getTournamentEvents({
          where: {
            id: event.id,
          },
        });
        if (!existingEvent || !existingEvent[0]) {
          await updatedModel.createTournamentEvent({
            name: event.name,
            minutes: event.minutes,
            link: event.link,
          });
        } else {
          await existingEvent[0].update({
            name: event.name,
            minutes: event.minutes,
            link: event.link,
          });
        }
      }
    }
  }
  return res.status(200).json(await updatedModel.reload());
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
    });
    const deletedTournament = await tournament[0].destroy();
    return res.status(200).json(deletedTournament);
  }
  return res.status(404).json('Not found');
});

export default tournamentsRouter;
