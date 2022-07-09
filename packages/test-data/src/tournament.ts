import {TournamentCreationAttributes} from 'scioly-bot-types';

const validTournament: TournamentCreationAttributes = {
  name: 'test tournament',
  active: false,
  submission: 'https://www.google.com',
  tournamentEvents: [
    {
      name: 'test event',
      minutes: 1000,
      link: 'https://www.google.com',
    },
  ],
};

const validTournamentWithoutEvents: TournamentCreationAttributes = {
  name: 'test tournament 2',
  active: true,
  submission: 'https://www.google.com',
  tournamentEvents: [],
};

const validOtherTournament: TournamentCreationAttributes = {
  name: "some other tournament mock user doesn't have access to",
  active: true,
  submission: 'https://www.github.com',
  tournamentEvents: [
    {
      name: 'other test event',
      minutes: 1000,
      link: 'https://www.google.com',
    },
  ],
};

const incompleteTournament = {};

const invalidTournament: TournamentCreationAttributes = {
  // Exceeds maximum length
  name: 'a loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong name over 100 characters long',
  active: false,
  submission: 'https://www.google.com/',
};

export {
  validTournament,
  validTournamentWithoutEvents,
  validOtherTournament,
  incompleteTournament,
  invalidTournament,
};
