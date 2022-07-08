import express, {RequestHandler, Express} from 'express';
import cors from 'cors';
import router from './routes';
import session from 'express-session';
import SequelizeStore from 'connect-session-sequelize';
import {SESSION_SECRET} from './configLoader';
const Store = SequelizeStore(session.Store);
import passport from 'passport';
import path from 'path';
import './strategies/discord';
import {Sequelize} from 'sequelize/types';

// Being able to pass in middleware before the API makes testing easier

const createApp = (
  database: Sequelize,
  middleware?: RequestHandler[],
): Express => {
  const app = express();
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  );
  app.use(express.json());

  app.use(
    session({
      secret: SESSION_SECRET,
      cookie: {
        maxAge: 60000 * 60 * 24 * 7,
      },
      resave: false,
      saveUninitialized: false,
      store: new Store({
        db: database,
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  middleware?.forEach((handler) => app.use(handler));

  app.use(express.static(path.resolve(__dirname, '../frontend/build')));

  app.use('/', router);

  return app;
};

export default createApp;
