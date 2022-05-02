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
const DATABASE_CONNECTION = getEnv('DATABASE_CONNECTION');
const NEXT_SECRET = getEnv('NEXT_SECRET');

export {
  DISCORD_TOKEN,
  CLIENT_ID,
  DISCORD_SECRET,
  GUILD_ID,
  DATABASE_CONNECTION,
  NEXT_SECRET,
};
