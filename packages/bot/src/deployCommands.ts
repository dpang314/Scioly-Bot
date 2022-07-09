import fs from 'fs';
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import {DISCORD_TOKEN, CLIENT_ID, GUILD_ID} from 'scioly-bot-config';
import {CommandInteraction} from 'discord.js';
import {SlashCommandBuilder} from '@discordjs/builders';
import path from 'path';

interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
}

// is of type RESTPostAPIApplicationCommandsJSONBody, but @discordjs/builders doesn't export the type
const commands: any[] = [];
const commandFiles = fs
  .readdirSync(path.resolve(__dirname, './commands'))
  .filter((file: string) => file.endsWith('.ts'));

commandFiles.forEach((file) => {
  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const command: Command = require(path.resolve(
    __dirname,
    `./commands/${file}`,
  ));
  commands.push(command.data.toJSON());
});

const rest = new REST({version: '9'}).setToken(DISCORD_TOKEN);

rest
  .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands})
  .then(() =>
    console.log(
      'Successfully registered application commands for testing server.',
    ),
  )
  .catch(console.error);

rest
  .put(Routes.applicationGuildCommands(CLIENT_ID, '518650826760257536'), {
    body: commands,
  })
  .then(() =>
    console.log(
      'Successfully registered application commands for Scioly server.',
    ),
  )
  .catch(console.error);
