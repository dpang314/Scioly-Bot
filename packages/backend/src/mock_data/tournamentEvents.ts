import {TournamentEventCreationAttributes} from 'scioly-bot-types';

const validTournamentEvent: TournamentEventCreationAttributes = {
  name: 'test event',
  minutes: 1000,
  link: 'www.google.com',
};

const incompleteTournamentEvent = {
  name: 'incomplete tournament event',
};

const invalidTournamentEvent: TournamentEventCreationAttributes = {
  name: 'test event',
  minutes: 10000000000,
  link: 'github.com',
};

export {
  validTournamentEvent,
  incompleteTournamentEvent,
  invalidTournamentEvent,
};
