import {
  TournamentCreationAttributes,
  TournamentUpdateAttributes,
} from 'scioly-bot-types';

const getTournaments = () => {
  return fetch(`/api/tournaments`);
};

const getTournament = (tournamentId: string) => {
  return fetch(`/api/tournaments/${tournamentId}`);
};

const createTournament = (tournament: TournamentCreationAttributes) => {
  return fetch(`/api/tournaments`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tournament),
  });
};

const updateTournament = (
  tournamentId: string,
  tournament: TournamentUpdateAttributes,
) => {
  return fetch(`/api/tournaments/${tournamentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tournament),
  });
};

const deleteTournament = (tournamentId: string) => {
  return fetch(`/api/tournaments/${tournamentId}`, {
    method: 'DELETE',
  });
};

export {
  getTournaments,
  getTournament,
  createTournament,
  updateTournament,
  deleteTournament,
};
