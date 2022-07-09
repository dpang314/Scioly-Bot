import createApp from './app';
import {DATABASE_CONNECTION} from 'scioly-bot-config';
import {createDatabase} from 'scioly-bot-models';

const database = createDatabase(DATABASE_CONNECTION);

const app = createApp(database);

const port = process.env.PORT || 5001;

app.listen(port, async () => {
  await database.sync();
  console.log(`Example app listening at http://localhost:${port}`);
});
