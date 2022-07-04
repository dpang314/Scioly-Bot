import {RequestHandler} from 'express';
import createApp from './app';
import {createDatabase, User} from './models';

const getMockData = async () => {
  const mockUserData = {
    id: 'testuser',
    discordName: 'Test User',
  };

  const mockDatabase = createDatabase('sqlite::memory:');

  await mockDatabase.sync();

  const mockUser = await User.create(mockUserData);

  const mockOtherUser = await User.create({
    id: 'some other user',
    discordName: 'Some other user',
  });

  const addMockUser: RequestHandler = (req, res, next) => {
    req.user = mockUserData;
    next();
  };

  const mockApp = createApp(mockDatabase, [addMockUser]);

  return {
    mockDatabase,
    mockApp,
    mockUser,
    mockOtherUser,
  };
};

export default getMockData;
