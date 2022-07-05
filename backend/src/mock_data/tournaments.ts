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

const validTournament2: TournamentCreationAttributes = {
  name: 'test tournament 2',
  active: true,
  submission: 'link',
  tournamentEvents: [
    {
      name: 'another test event',
      minutes: 10,
      link: 'another test event link',
    },
  ],
};

const validOtherTournament: TournamentCreationAttributes = {
  name: "some other tournament mock user doesn't have access to",
  active: true,
  submission: 'https://github.com/',
  tournamentEvents: [],
};

const incompleteTournament = {
  name: 'hunter2',
};

const invalidTournament: TournamentCreationAttributes = {
  name: 'test tournament',
  active: false,
  submission: 'https://google.com/',
  tournamentEvents: [
    {
      name: 'test event',
      // Exceeds maximum time set with yup
      minutes: 10000000,
      link: 'test event link',
    },
  ],
};

export {
  validTournament,
  validTournament2,
  validOtherTournament,
  incompleteTournament,
  invalidTournament,
};
