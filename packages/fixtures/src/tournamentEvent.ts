import {
  TournamentEventAttributes,
  TournamentEventCreationAttributes,
} from 'scioly-bot-types';

const validTournamentEvent: TournamentEventCreationAttributes = {
  name: 'test event',
  minutes: 1000,
  link: 'https://www.google.com',
};

const incompleteTournamentEvent = {
  name: 'incomplete tournament event',
};

const invalidTournamentEvent: TournamentEventCreationAttributes = {
  name: 'test event',
  minutes: 10000000000,
  link: 'https://www.github.com',
};

const validCompleteTournamentEvent: TournamentEventAttributes = {
  ...validTournamentEvent,
  id: 'valid tournament event with all attributes',
};

export {
  validTournamentEvent,
  incompleteTournamentEvent,
  invalidTournamentEvent,
  validCompleteTournamentEvent,
};
