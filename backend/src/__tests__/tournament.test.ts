import request from 'supertest';

import getMockData from '../mockData';

import {Tournament} from '../models';

describe('tournament endpoint', () => {
  let mockData;
  let server;
  beforeAll(async () => {
    mockData = await getMockData();
    await Tournament.create({
      userId: mockData.mockUser.id,
      name: 'test tournament',
      active: false,
      submission: 'https://google.com/',
    });
    server = request(mockData.mockApp);
  });
  describe('GET', () => {
    test('GET /', async () => {
      const response = await server.get('/api/tournaments');
      expect(response.statusCode).toBe(200);
    });
  });
});
