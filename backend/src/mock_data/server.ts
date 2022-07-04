import {RequestHandler} from 'express';
import createApp from '../app';
import {createDatabase} from '../models';
import {mockUser} from './users';

const mockDatabase = createDatabase('sqlite::memory:');

mockDatabase.sync();

const addMockUser: RequestHandler = (req, res, next) => {
  req.user = mockUser;
  next();
};

const mockApp = createApp(mockDatabase, [addMockUser]);

export {mockDatabase, mockApp};
