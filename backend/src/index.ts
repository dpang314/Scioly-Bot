import createApp from './app';
import {DATABASE_CONNECTION} from './configLoader';
import {createDatabase} from 'scioly-bot-common';

const database = createDatabase(DATABASE_CONNECTION);

const app = createApp(database);

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  await database.sync();
  console.log(`Example app listening at http://localhost:${port}`);
});
