import express from 'express';
import cors from 'cors';
import router from './routes';
import session from 'express-session';
import SequelizeStore from 'connect-session-sequelize';
import { SESSION_SECRET } from './configLoader';
const Store = SequelizeStore(session.Store);
import { db } from './models';
import passport from 'passport';
import './strategies/discord';
import path from 'path';

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.use(session({
  secret: SESSION_SECRET,
  cookie: {
    maxAge: 60000 * 60 * 24 * 7,
  },
  resave: false,
  saveUninitialized: false,
  store: new Store({
    db,
  })
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/', router);

app.use(express.static(path.resolve(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  db.sync();
  console.log(`Example app listening at http://localhost:${port}`);
});

export default app;
