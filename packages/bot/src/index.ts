import {Client, Collection, CommandInteraction, Intents} from 'discord.js';
import * as fs from 'fs';
import path from 'path';
import {DATABASE_CONNECTION, DISCORD_TOKEN} from 'scioly-bot-config';
import {createDatabase} from 'scioly-bot-models';
import checkTests from './tasks/checkTests';

interface SlashCommand {
  data: any;
  // eslint-disable-next-line no-unused-vars
  execute: (i: CommandInteraction) => void;
}

interface CommandClient extends Client {
  commands: Collection<string, SlashCommand>;
}

const client: CommandClient = new Client({
  intents: [Intents.FLAGS.GUILDS],
}) as CommandClient;
client.commands = new Collection();

const commandFiles = fs
  .readdirSync(path.resolve(__dirname, './commands'))
  .filter((file: string) => file.endsWith('.ts') || file.endsWith('.js'));

commandFiles.forEach((file) => {
  const command = require(path.resolve(__dirname, `./commands/${file}`));
  client.commands.set(command.data.name, command);
});

client.once('ready', async () => {
  createDatabase(DATABASE_CONNECTION);
  setInterval(checkTests, 10 * 1000);
  console.log('bot started');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

client.login(DISCORD_TOKEN);

export {client};
export type {CommandClient};
