import request from 'supertest';

import {Test, Tournament, TournamentEvent} from 'scioly-bot-models';
import {
  validTournament,
  validOtherTournament,
  invalidTournament,
  incompleteTournament,
  validTournamentWithoutEvents,
  validTournamentEvent,
} from 'scioly-bot-fixtures';
import createMockApp, {MockApp} from '../mock-app/app';

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
      // can't use id because the user should never be able
      // to define an id manually
      const newTournament = await mockData.mockUser.getTournaments({
        where: {
          name: validTournament.name,
          active: validTournament.active,
          submission: validTournament.submission,
        },
        include: [{model: TournamentEvent, as: 'tournamentEvents'}],
      });
      expect(response.body).toStrictEqual({
        ...validTournament,
        tournamentEvents: [
          {
            ...validTournament.tournamentEvents![0],
            id: newTournament[0].tournamentEvents![0].id,
            tournamentId: newTournament[0].id,
          },
        ],
        id: newTournament[0].id,
      });
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

    test('valid tournament adds event', async () => {
      const response = await server
        .put(`/api/tournaments/${tournament.id}`)
        .send(validOtherTournament);
      await tournament.reload();
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        ...tournament.toJSON(),
        ...validOtherTournament,
        tournamentEvents: [
          {
            id: tournament.tournamentEvents![0].id,
            link: validOtherTournament.tournamentEvents![0].link,
            minutes: validOtherTournament.tournamentEvents![0].minutes,
            name: validOtherTournament.tournamentEvents![0].name,
            tournamentId: tournament.id,
          },
        ],
        userId: tournament.userId,
      });
    });
    test('valid tournament removes event', async () => {
      const response = await server
        .put(`/api/tournaments/${tournament.id}`)
        .send(validTournamentWithoutEvents);
      await tournament.reload();
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        ...tournament.toJSON(),
        ...validTournamentWithoutEvents,
        tournamentEvents: [],
        userId: tournament.userId,
      });
    });
    test('valid tournament removing event deletes associated tests', async () => {
      const event = await tournament.createTournamentEvent(
        validTournamentEvent,
      );
      await event.createTest({
        userId: 'user id',
        timeStarted: new Date(),
        finished: false,
      });
      await server
        .put(`/api/tournaments/${tournament.id}`)
        .send(validTournamentWithoutEvents);
      expect(await Test.count()).toBe(0);
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

  describe('PATCH', () => {
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

    test('valid partial tournament succeeds', async () => {
      const response = await server
        .patch(`/api/tournaments/${tournament.id}`)
        .send(incompleteTournament);
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        ...tournament.toJSON(),
        ...incompleteTournament,
      });
    });
    test('tournament with invalid field returns 400', async () => {
      const response = await server
        .patch(`/api/tournaments/${tournament.id}`)
        .send(invalidTournament);
      expect(response.statusCode).toBe(400);
    });
    test("modifying a different user's tournament returns 404", async () => {
      const response = await server.patch(
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
      expect(response.body).toStrictEqual({});
      expect(await Tournament.count({where: {id: tournament.id}})).toBe(0);
      tournament.tournamentEvents?.forEach(async (tournamentEvent) => {
        expect(
          await TournamentEvent.count({where: {id: tournamentEvent.id}}),
        ).toBe(0);
      });
    });

    test("deleting a different user's tournament returns 404", async () => {
      const response = await server.delete(
        `/api/tournaments/${otherTournament.id}`,
      );
      expect(response.statusCode).toBe(404);
    });

    test('deleting a nonexistent tournament returns 404', async () => {
      const response = await server.delete(
        '/api/tournaments/this-is-not-a-real-id',
      );
      expect(response.statusCode).toBe(404);
    });

    test('deleting a tournament deletes all tests', async () => {
      const event = await tournament.createTournamentEvent(
        validTournamentEvent,
      );
      await event.createTest({
        userId: 'user id',
        timeStarted: new Date(),
        finished: false,
      });
      await server.delete(`/api/tournaments/${tournament.id}`);
      expect(await Test.count()).toBe(0);
    });
  });
});
