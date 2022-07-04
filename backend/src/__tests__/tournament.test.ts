import {Express} from 'express';
import {Sequelize} from 'sequelize/types';
import request from 'supertest';

import getMockData from '../mockData';

import {Tournament, TournamentEvent, User} from '../models';
import {TournamentCreationAttributes} from '../models/TournamentModel';

describe('tournament endpoint', () => {
  let mockData: {
    mockDatabase: Sequelize;
    mockApp: Express;
    mockUser: User;
    mockOtherUser: User;
  };
  let server: request.SuperTest<request.Test>;
  beforeAll(async () => {
    mockData = await getMockData();
    server = request(mockData.mockApp);
  });

  describe('GET', () => {
    let tournament: Tournament;
    let otherTournament: Tournament;

    beforeEach(async () => {
      // clears database
      await mockData.mockDatabase.sync({force: true});
      tournament = await Tournament.create(
        {
          userId: mockData.mockUser.id,
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
        },
        {include: [{model: TournamentEvent, as: 'tournamentEvents'}]},
      );
      otherTournament = await Tournament.create(
        {
          userId: mockData.mockOtherUser.id,
          name: "some other tournament mock user doesn't have access to",
          active: true,
          submission: 'https://github.com/',
        },
        {include: [{model: TournamentEvent, as: 'tournamentEvents'}]},
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
    let tournament: TournamentCreationAttributes;

    beforeEach(async () => {
      await mockData.mockDatabase.sync({force: true});
      tournament = {
        userId: mockData.mockUser.id,
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
    });
    test('valid tournament succeeds', async () => {
      const response = await server.post('/api/tournaments').send(tournament);
      expect(response.statusCode).toBe(200);
    });
    test('invalid tournament returns 400', async () => {
      const response = await server
        .post('/api/tournaments')
        .send({password: 'hunter2'});
      expect(response.statusCode).toBe(400);
    });
    // TODO add a test with a template
  });
});
