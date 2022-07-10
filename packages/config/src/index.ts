import * as dotenv from 'dotenv';

dotenv.config({path: __dirname + '/../../../.env'});

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
const DATABASE_CONNECTION = getEnv('DATABASE_CONNECTION');
const SESSION_SECRET = getEnv('SESSION_SECRET');
const NODE_ENV = getEnv('NODE_ENV');

export {
  DISCORD_TOKEN,
  CLIENT_ID,
  DISCORD_SECRET,
  GUILD_ID,
  DATABASE_CONNECTION,
  SESSION_SECRET,
  NODE_ENV,
};
