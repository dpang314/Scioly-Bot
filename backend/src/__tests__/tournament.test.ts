import request from 'supertest';

import {mockApp, mockDatabase} from '../mock_data/server';
import {mockUser, mockOtherUser} from '../mock_data/users';

import {Tournament, TournamentEvent, User} from '../models';
import {
  validTournament,
  validOtherTournament,
  invalidTournament,
  incompleteTournament,
} from '../mock_data/tournaments';

describe('tournament endpoint', () => {
  let server: request.SuperTest<request.Test>;
  beforeAll(async () => {
    server = request(mockApp);
  });

  describe('GET', () => {
    let tournament: Tournament;
    let otherTournament: Tournament;

    beforeEach(async () => {
      // clears database
      await mockDatabase.sync({force: true});
      await User.create(mockUser);
      await User.create(mockOtherUser);
      tournament = await Tournament.create(validTournament, {
        include: [{model: TournamentEvent, as: 'tournamentEvents'}],
      });
      otherTournament = await Tournament.create(validOtherTournament, {
        include: [{model: TournamentEvent, as: 'tournamentEvents'}],
      });
    });
    test("getting list only returns user's tournaments", async () => {
      const response = await server.get('/api/tournaments');
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual([tournament.toJSON()]);
    });

    test('getting a tournament by id succeeds', async () => {
      const response = await server.get(`/api/tournaments/${tournament.id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(tournament.toJSON());
    });

    test("getting a different user's tournament returns 401", async () => {
      const response = await server.get(
        `/api/tournaments/${otherTournament.id}`,
      );
      expect(response.statusCode).toBe(401);
    });

    test('getting a nonexistent tournament returns 404', async () => {
      const response = await server.get(
        '/api/tournaments/this-is-not-a-real-id',
      );
      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST', () => {
    beforeEach(async () => {
      await mockDatabase.sync({force: true});
    });
    test('valid tournament succeeds', async () => {
      const response = await server
        .post('/api/tournaments')
        .send(validTournament);
      expect(response.statusCode).toBe(200);
    });
    test('incomplete tournament returns 400', async () => {
      const response = await server
        .post('/api/tournaments')
        .send(incompleteTournament);
      expect(response.statusCode).toBe(400);
    });
    test('tournament with invalid field returns 400', async () => {
      const response = await server
        .post('/api/tournaments')
        .send(invalidTournament);
      expect(response.statusCode).toBe(400);
    });
    // TODO add a test with a template
  });
});
