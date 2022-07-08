import {RequestHandler} from 'express';
import createApp from '../app';
import {Express} from 'express';
import {Sequelize} from 'sequelize/types';
import {User, createDatabase} from 'scioly-bot-models';

// Since req.user must be an actual User object, a User must be created
// before initializing the middleware

interface MockApp {
  mockApp: Express;
  mockDatabase: Sequelize;
  mockUser: User;
  mockOtherUser: User;
}

const mockDatabase = createDatabase('sqlite::memory:');

const createMockApp = async (): Promise<MockApp> => {
  await mockDatabase.sync({force: true});

  const mockUser = await User.create({
    id: 'testuser',
    discordName: 'Test User',
  });

  const mockOtherUser = await User.create({
    id: 'some other user',
    discordName: 'Some other user',
  });

  const addMockUser: RequestHandler = (req, res, next) => {
    req.user = mockUser;
    next();
  };

  const mockApp = createApp(mockDatabase, [addMockUser]);

  return {
    mockApp,
    mockDatabase,
    mockUser,
    mockOtherUser,
  };
};

export default createMockApp;
export type {MockApp};
