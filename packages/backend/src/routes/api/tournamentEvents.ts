import {Router} from 'express';
import {TournamentEvent} from 'scioly-bot-models';
import {
  TournamentEventCreationAttributes,
  tournamentEventCreationSchema,
  TournamentEventUpdateAttributes,
  tournamentEventUpdateSchema,
} from 'scioly-bot-types';

const tournamentEventsRouter = Router();

tournamentEventsRouter.get('/:tournamentId/events', async (req, res) => {
  const {tournamentId} = req.params;
  const tournaments = await req.user?.getTournaments({
    where: {id: tournamentId},
    include: [{model: TournamentEvent, as: 'tournamentEvents'}],
  });
  if (!tournaments || !tournaments[0]) return res.status(404).json('Not found');
  // Return tournament events or empty
  return res
    .status(200)
    .json(
      tournaments[0].tournamentEvents ? tournaments[0].tournamentEvents : [],
    );
});

tournamentEventsRouter.get(
  '/:tournamentId/events/:eventId',
  async (req, res) => {
    const {tournamentId, eventId} = req.params;
    const tournaments = await req.user?.getTournaments({
      where: {id: tournamentId},
      include: [{model: TournamentEvent, as: 'tournamentEvents'}],
    });
    if (!tournaments || !tournaments[0])
      return res.status(404).json('Not found');
    const tournamentEvent = await tournaments[0].getTournamentEvents({
      where: {
        id: eventId,
      },
    });
    if (!tournamentEvent || !tournamentEvent[0])
      return res.status(404).json('Not found');
    return res.status(200).json(tournamentEvent[0]);
  },
);

tournamentEventsRouter.post('/:tournamentId/events', async (req, res) => {
  const {tournamentId} = req.params;
  const tournaments = await req.user?.getTournaments({
    where: {id: tournamentId},
    include: [{model: TournamentEvent, as: 'tournamentEvents'}],
  });
  if (!tournaments || !tournaments[0]) return res.status(404).json('Not found');
  const tournamentEvent: TournamentEventCreationAttributes = {
    name: req.body.name,
    link: req.body.link,
    minutes: req.body.minutes,
  };
  let validatedTournamentEvent;
  try {
    validatedTournamentEvent = await tournamentEventCreationSchema.validate(
      tournamentEvent,
    );
  } catch (e) {
    return res.status(400).send('Invalid tournament');
  }

  const tournamentEventModel = await tournaments[0].createTournamentEvent(
    validatedTournamentEvent,
  );
  return res.status(200).send(tournamentEventModel);
});

tournamentEventsRouter.patch(
  '/:tournamentId/events/:eventId',
  async (req, res) => {
    const {tournamentId, eventId} = req.params;
    const tournaments = await req.user?.getTournaments({
      where: {id: tournamentId},
      include: [{model: TournamentEvent, as: 'tournamentEvents'}],
    });
    if (!tournaments || !tournaments[0])
      return res.status(404).json('Not found');
    const tournamentEventAttributes: TournamentEventUpdateAttributes = {
      id: eventId,
      ...req.body,
    };
    let validatedTournamentEvent;
    try {
      validatedTournamentEvent = await tournamentEventUpdateSchema.validate(
        tournamentEventAttributes,
      );
    } catch (e) {
      return res.status(400).send('Invalid tournament');
    }
    const tournamentEvent = await tournaments[0].getTournamentEvents({
      where: {
        id: eventId,
      },
    });
    if (!tournamentEvent || !tournamentEvent[0])
      return res.status(404).json('Not found');
    const updatedModel = await tournamentEvent[0].update(
      validatedTournamentEvent,
    );
    return res.status(200).json(updatedModel);
  },
);

tournamentEventsRouter.delete(
  '/:tournamentId/events/:eventId',
  async (req, res) => {
    const {tournamentId, eventId} = req.params;
    const tournaments = await req.user?.getTournaments({
      where: {id: tournamentId},
      include: [{model: TournamentEvent, as: 'tournamentEvents'}],
    });
    if (!tournaments || !tournaments[0])
      return res.status(404).json('Not found');
    const tournamentEvent = await tournaments[0].getTournamentEvents({
      where: {
        id: eventId,
      },
    });
    if (!tournamentEvent || !tournamentEvent[0])
      return res.status(404).json('Not found');
    const deletedTournamentEvent = await tournamentEvent[0].destroy();
    return res.status(200).json(deletedTournamentEvent);
  },
);

export default tournamentEventsRouter;
