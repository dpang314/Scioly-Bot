import request from 'supertest';

import {Tournament, TournamentEvent} from '../models';
import {
  validTournament,
  validOtherTournament,
  invalidTournament,
  incompleteTournament,
  validTournament2,
} from '../mock_data/tournaments';
import createMockApp, {MockApp} from '../mock_data/app';

describe('tournament endpoint', () => {
  let server: request.SuperTest<request.Test>;
  let mockData: MockApp;
  beforeEach(async () => {
    mockData = await createMockApp();
    server = request(mockData.mockApp);
  });

  describe('GET', () => {
    describe('without tournaments', () => {
      test('getting list of user without tournaments returns empty array', async () => {
        const response = await server.get('/api/tournaments');
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
      });
    });

    describe('with tournaments', () => {
      let tournament: Tournament;
      let otherTournament: Tournament;

      beforeEach(async () => {
        tournament = await mockData.mockUser.createTournament(validTournament, {
          include: [{model: TournamentEvent, as: 'tournamentEvents'}],
        });
        otherTournament = await mockData.mockOtherUser.createTournament(
          validOtherTournament,
          {
            include: [{model: TournamentEvent, as: 'tournamentEvents'}],
          },
        );
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

      test("getting a different user's tournament returns 404", async () => {
        const response = await server.get(
          `/api/tournaments/${otherTournament.id}`,
        );
        expect(response.statusCode).toBe(404);
      });

      test('getting a nonexistent tournament returns 404', async () => {
        const response = await server.get(
          '/api/tournaments/this-is-not-a-real-id',
        );
        expect(response.statusCode).toBe(404);
      });
    });
  });

  describe('POST', () => {
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

  describe('PUT', () => {
    let tournament: Tournament;
    let otherTournament: Tournament;

    beforeEach(async () => {
      tournament = await mockData.mockUser.createTournament(validTournament, {
        include: [{model: TournamentEvent, as: 'tournamentEvents'}],
      });
      otherTournament = await mockData.mockOtherUser.createTournament(
        validOtherTournament,
        {
          include: [{model: TournamentEvent, as: 'tournamentEvents'}],
        },
      );
    });

    test('valid tournament succeeds', async () => {
      const response = await server
        .put(`/api/tournaments/${tournament.id}`)
        .send(validOtherTournament);
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        ...validOtherTournament,
        user: mockData.mockUser.id,
        id: tournament.id,
      });
    });
    test('valid tournament replaces tournamentEvents', async () => {
      const response = await server
        .put(`/api/tournaments/${tournament.id}`)
        .send(validTournament2);
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        ...validTournament2,
        tournamentEvents: [
          {
            ...validTournament2.tournamentEvents![0],
            tournamentId: tournament.id,
          },
        ],
        user: mockData.mockUser.id,
        id: tournament.id,
      });
    });
    test('incomplete tournament returns 400', async () => {
      const response = await server
        .put(`/api/tournaments/${tournament.id}`)
        .send(incompleteTournament);
      expect(response.statusCode).toBe(400);
    });
    test('tournament with invalid field returns 400', async () => {
      const response = await server
        .put(`/api/tournaments/${tournament.id}`)
        .send(invalidTournament);
      expect(response.statusCode).toBe(400);
    });
    test("modifying a different user's tournament returns 404", async () => {
      const response = await server.put(
        `/api/tournaments/${otherTournament.id}`,
      );
      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE', () => {
    let tournament: Tournament;
    let otherTournament: Tournament;

    beforeEach(async () => {
      tournament = await mockData.mockUser.createTournament(validTournament, {
        include: [{model: TournamentEvent, as: 'tournamentEvents'}],
      });
      otherTournament = await mockData.mockOtherUser.createTournament(
        validOtherTournament,
        {
          include: [{model: TournamentEvent, as: 'tournamentEvents'}],
        },
      );
    });

    test('deleting a tournament by id succeeds', async () => {
      const response = await server.delete(`/api/tournaments/${tournament.id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(tournament.toJSON());
      expect(await Tournament.count({where: {id: tournament.id}})).toBe(0);
      tournament.tournamentEvents?.forEach(async (tournamentEvent) => {
        expect(
          await TournamentEvent.count({where: {id: tournamentEvent.id}}),
        ).toBe(0);
      });
    });

    test("getting a different user's tournament returns 404", async () => {
      const response = await server.delete(
        `/api/tournaments/${otherTournament.id}`,
      );
      expect(response.statusCode).toBe(404);
    });

    test('getting a nonexistent tournament returns 404', async () => {
      const response = await server.delete(
        '/api/tournaments/this-is-not-a-real-id',
      );
      expect(response.statusCode).toBe(404);
    });
  });
});
