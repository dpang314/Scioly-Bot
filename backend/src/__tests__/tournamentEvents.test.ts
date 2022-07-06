import request from 'supertest';

import {Tournament, TournamentEvent} from '../models';
import {
  validTournament,
  validOtherTournament,
  validTournamentWithoutEvents,
} from '../mock_data/tournaments';
import {
  incompleteTournamentEvent,
  invalidTournamentEvent,
  validTournamentEvent,
} from '../mock_data/tournamentEvents';
import createMockApp, {MockApp} from '../mock_data/app';

describe('tournament event endpoint', () => {
  let server: request.SuperTest<request.Test>;
  let mockData: MockApp;
  beforeEach(async () => {
    mockData = await createMockApp();
    server = request(mockData.mockApp);
  });

  describe('GET', () => {
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

    test('getting list of tournament without tournament events returns empty array', async () => {
      const tournamentWithoutEvents = await mockData.mockUser.createTournament(
        validTournamentWithoutEvents,
      );
      const response = await server.get(
        `/api/tournaments/${tournamentWithoutEvents.id}/events`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual([]);
    });

    test("getting list returns tournament's events", async () => {
      const response = await server.get(
        `/api/tournaments/${tournament.id}/events`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(
        tournament.tournamentEvents?.map((event) => event.toJSON()),
      );
    });

    test('getting a tournament event by id succeeds', async () => {
      const response = await server.get(
        `/api/tournaments/${tournament.id}/events/${
          tournament.tournamentEvents![0].id
        }`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(
        tournament.tournamentEvents![0].toJSON(),
      );
    });

    test("getting a different user's tournament event returns 404", async () => {
      const response = await server.get(
        `/api/tournaments/${otherTournament.id}/events/${
          otherTournament.tournamentEvents![0].id
        }`,
      );
      expect(response.statusCode).toBe(404);
    });

    test('getting a nonexistent tournament event returns 404', async () => {
      const response = await server.get(
        `/api/tournaments/${tournament.id}/events/this-is-not-a-real-event-id`,
      );
      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST', () => {
    let tournamentWithoutEvents: Tournament;

    beforeEach(async () => {
      tournamentWithoutEvents = await mockData.mockUser.createTournament(
        validTournamentWithoutEvents,
      );
    });

    test('creating tournament event on nonexistent tournament returns 404', async () => {
      const response = await server
        .post(`/api/tournaments/this-is-not-a-real-tournament/events`)
        .send(validTournamentEvent);
      expect(response.statusCode).toBe(404);
    });
    test("posting to other user's tournament fails", async () => {
      const otherTournament = await mockData.mockOtherUser.createTournament(
        validOtherTournament,
      );
      const response = await server
        .post(`/api/tournaments/${otherTournament.id}/events`)
        .send(validTournamentEvent);
      expect(response.statusCode).toBe(404);
    });
    test('valid tournament event succeeds', async () => {
      const response = await server
        .post(`/api/tournaments/${tournamentWithoutEvents.id}/events`)
        .send(validTournamentEvent);
      expect(response.statusCode).toBe(200);
      // can't use id because the user should never be able
      // to define an id manually
      const newTournamentEvent =
        await tournamentWithoutEvents.getTournamentEvents();
      expect(newTournamentEvent.length).toBe(1);
      expect(response.body).toStrictEqual(newTournamentEvent![0].toJSON());
    });
    test('incomplete tournament event returns 400', async () => {
      const response = await server
        .post(`/api/tournaments/${tournamentWithoutEvents.id}/events`)
        .send(incompleteTournamentEvent);
      expect(response.statusCode).toBe(400);
    });
    test('tournament with invalid field returns 400', async () => {
      const response = await server
        .post(`/api/tournaments/${tournamentWithoutEvents.id}/events`)
        .send(invalidTournamentEvent);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('PATCH', () => {
    let tournament: Tournament;
    let otherTournament: Tournament;
    let tournamentEvent: TournamentEvent;

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
      tournamentEvent = await tournament.createTournamentEvent(
        validTournamentEvent,
      );
    });

    test('invalid tournament returns 404', async () => {
      const response = await server.patch(
        `/api/tournaments/not-an-actual-id/events/${tournamentEvent.id}`,
      );
      expect(response.statusCode).toBe(404);
    });

    test('invalid tournament event id returns 404', async () => {
      const response = await server.patch(
        `/api/tournaments/${tournament.id}/events/not-an-actual-id`,
      );
      expect(response.statusCode).toBe(404);
    });

    test('valid partial tournament event succeeds', async () => {
      const response = await server
        .patch(`/api/tournaments/${tournament.id}/events/${tournamentEvent.id}`)
        .send(incompleteTournamentEvent);
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        ...tournamentEvent.toJSON(),
        ...incompleteTournamentEvent,
      });
    });
    test('tournament event with invalid field returns 400', async () => {
      const response = await server
        .patch(`/api/tournaments/${tournament.id}/events/${tournamentEvent.id}`)
        .send(invalidTournamentEvent);
      expect(response.statusCode).toBe(400);
    });
    test("modifying a different user's tournament returns 404", async () => {
      const response = await server.patch(
        `/api/tournaments/${otherTournament.id}/events/${tournamentEvent.id}`,
      );
      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE', () => {
    let tournament: Tournament;
    let tournamentEvent: TournamentEvent;

    beforeEach(async () => {
      tournament = await mockData.mockUser.createTournament(
        validTournamentWithoutEvents,
        {
          include: [{model: TournamentEvent, as: 'tournamentEvents'}],
        },
      );
      tournamentEvent = await tournament.createTournamentEvent(
        validTournamentEvent,
      );
    });

    test('invalid tournament returns 404', async () => {
      const response = await server.delete(
        `/api/tournaments/not-an-actual-id/events/${tournamentEvent.id}`,
      );
      expect(response.statusCode).toBe(404);
    });

    test('invalid tournament event id returns 404', async () => {
      const response = await server.delete(
        `/api/tournaments/${tournament.id}/events/not-an-actual-id`,
      );
      expect(response.statusCode).toBe(404);
    });

    test('deleting a tournament event by id succeeds', async () => {
      const response = await server.delete(
        `/api/tournaments/${tournament.id}/events/${tournamentEvent.id}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(tournamentEvent.toJSON());
      expect(
        await TournamentEvent.count({where: {id: tournamentEvent.id}}),
      ).toBe(0);
      tournament.tournamentEvents?.forEach(async (tournamentEvent) => {
        expect(
          await TournamentEvent.count({where: {id: tournamentEvent.id}}),
        ).toBe(0);
      });
    });

    test("deleting a different user's tournament returns 404", async () => {
      const otherTournament = await mockData.mockOtherUser.createTournament(
        validOtherTournament,
        {
          include: [{model: TournamentEvent, as: 'tournamentEvents'}],
        },
      );
      const otherTournamentEvent = await otherTournament.createTournamentEvent(
        validTournamentEvent,
      );
      const response = await server.delete(
        `/api/tournaments/${otherTournament.id}/events/${otherTournamentEvent.id}`,
      );
      expect(response.statusCode).toBe(404);
    });
  });
});
