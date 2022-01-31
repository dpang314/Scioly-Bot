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
}


const DISCORD_TOKEN = getEnv('DISCORD_TOKEN');
const CLIENT_ID = getEnv('CLIENT_ID');
const GUILD_ID = getEnv('GUILD_ID');
const CHANNEL_ID = getEnv('CHANNEL_ID');
const MONGO_URI = getEnv('MONGO_URI');
const SUBMISSION_LINK = getEnv('SUBMISSION_LINK');
const GUIDELINES_LINK = getEnv('GUIDELINES_LINK');
const DATABASE_USERNAME = getEnv('DATABASE_USERNAME');
const DATABASE_PASSWORD = getEnv('DATABASE_PASSWORD');
const DATABASE_HOST = getEnv('DATABASE_HOST');
const DATABASE_PORT = parseInt(getEnv('DATABASE_PORT'));

export {
  DISCORD_TOKEN,
  CLIENT_ID,
  GUILD_ID,
  CHANNEL_ID,
  MONGO_URI,
  SUBMISSION_LINK,
  GUIDELINES_LINK,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_PORT
};