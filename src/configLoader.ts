import * as dotenv from 'dotenv';

dotenv.config();

const getEnv = (key: string): string => {
  let env: string;
  if (process.env[key]) {
    env = process.env[key] as string;
  } else {
    throw new Error(`${key} environment variable is not set`);
  }
  return env;
};

const DISCORD_TOKEN = getEnv('DISCORD_TOKEN');
const CLIENT_ID = getEnv('CLIENT_ID');
const DISCORD_SECRET = getEnv('DISCORD_SECRET');
const GUILD_ID = getEnv('GUILD_ID');
const CHANNEL_ID = getEnv('CHANNEL_ID');
const MONGO_URI = getEnv('MONGO_URI');
const SUBMISSION_LINK = getEnv('SUBMISSION_LINK');
const GUIDELINES_LINK = getEnv('GUIDELINES_LINK');
const DATABASE_CONNECTION = getEnv('DATABASE_CONNECTION');
const DEV = process.env.NODE_ENV !== 'production';
const SERVER = process.env.NODE_ENV !== 'production' ? 'http://localhost' : '';
const PORT = 3000;
const NEXT_SECRET = getEnv('NEXT_SECRET');

export {
  DISCORD_TOKEN,
  CLIENT_ID,
  DISCORD_SECRET,
  GUILD_ID,
  CHANNEL_ID,
  MONGO_URI,
  SUBMISSION_LINK,
  GUIDELINES_LINK,
  DATABASE_CONNECTION,
  DEV,
  SERVER,
  PORT,
  NEXT_SECRET,
};
