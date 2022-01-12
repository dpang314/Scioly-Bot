import { Client, Collection, CommandInteraction, Intents } from "discord.js";
import { DISCORD_TOKEN } from '../configLoader';

interface SlashCommand {
  data: any,
  execute: (i: CommandInteraction) => void
}

interface CommandClient extends Client {
  commands: Collection<string, SlashCommand>
}

import * as fs from 'fs';
import { CHANNEL_ID } from '../configLoader';
import checkTests from "../../tasks/checkTests";

const client: CommandClient = new Client({ intents: [Intents.FLAGS.GUILDS] }) as CommandClient;
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter((file: string) => file.endsWith('.ts'));

for (const file of commandFiles) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log('Ready!');
  setInterval(checkTests, 60 * 1000);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  
  if (!command) return;
  
  if (interaction.channelId !== CHANNEL_ID) {
    const channel = client.channels.cache.get(CHANNEL_ID)?.toString();
    await interaction.reply({ content: `Run command in ${channel}`, ephemeral: true });
  } else {
    try {
      await command.execute(interaction);
    }
    catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

client.login(DISCORD_TOKEN);

export { client, CommandClient };