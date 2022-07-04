import {UserAttributes} from '../models/User';

const mockUser: UserAttributes = {
  id: 'testuser',
  discordName: 'Test User',
};

const mockOtherUser: UserAttributes = {
  id: 'some other user',
  discordName: 'Some other user',
};

export {mockUser, mockOtherUser};
