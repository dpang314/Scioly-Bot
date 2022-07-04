import {TournamentCreationAttributes} from '../models/TournamentModel';
import {mockOtherUser, mockUser} from './users';

const validTournament: TournamentCreationAttributes = {
  userId: mockUser.id,
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

const validOtherTournament: TournamentCreationAttributes = {
  userId: mockOtherUser.id,
  name: "some other tournament mock user doesn't have access to",
  active: true,
  submission: 'https://github.com/',
};

const incompleteTournament = {
  name: 'hunter2',
};

const invalidTournament = {
  userId: mockUser.id,
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
  validOtherTournament,
  incompleteTournament,
  invalidTournament,
};
