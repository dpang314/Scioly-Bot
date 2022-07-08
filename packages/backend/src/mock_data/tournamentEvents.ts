import {TournamentEventCreationAttributes} from 'scioly-bot-types';

const validTournamentEvent: TournamentEventCreationAttributes = {
  name: 'test event',
  minutes: 1000,
  link: 'test event link',
};

const incompleteTournamentEvent = {
  name: 'incomplete tournament event',
};

const invalidTournamentEvent: TournamentEventCreationAttributes = {
  name: 'test event',
  minutes: 10000000000,
  link: 'test event link',
};

export {
  validTournamentEvent,
  incompleteTournamentEvent,
  invalidTournamentEvent,
};
