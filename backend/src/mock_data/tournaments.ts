import {TournamentCreationAttributes} from '../models/TournamentModel';

const validTournament: TournamentCreationAttributes = {
  name: 'test tournament',
  active: false,
  submission: 'https://google.com/',
  tournamentEvents: [
    {
      name: 'test event',
      minutes: 1000,
      link: 'test event link',
    },
  ],
};

const validTournamentWithoutEvents: TournamentCreationAttributes = {
  name: 'test tournament 2',
  active: true,
  submission: 'link',
  tournamentEvents: [],
};

const validOtherTournament: TournamentCreationAttributes = {
  name: "some other tournament mock user doesn't have access to",
  active: true,
  submission: 'https://github.com/',
  tournamentEvents: [
    {
      name: 'other test event',
      minutes: 1000,
      link: 'test event link',
    },
  ],
};

const incompleteTournament = {};

const invalidTournament: TournamentCreationAttributes = {
  // Exceeds maximum length
  name: 'a loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong name over 100 characters long',
  active: false,
  submission: 'https://google.com/',
};

export {
  validTournament,
  validTournamentWithoutEvents,
  validOtherTournament,
  incompleteTournament,
  invalidTournament,
};
