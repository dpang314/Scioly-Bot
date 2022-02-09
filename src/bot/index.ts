import { Client, Collection, CommandInteraction, Intents } from "discord.js";
import { DISCORD_TOKEN } from '../configLoader';
import * as fs from 'fs';
import checkTests from "./tasks/checkTests";
import { initDB } from "../models";
import path from "path";

interface SlashCommand {
  data: any,
  execute: (i: CommandInteraction) => void
}

interface CommandClient extends Client {
  commands: Collection<string, SlashCommand>
}

const client: CommandClient = new Client({ intents: [Intents.FLAGS.GUILDS] }) as CommandClient;
client.commands = new Collection();

const commandFiles = fs.readdirSync(path.resolve(__dirname, './commands')).filter((file: string) => file.endsWith('.ts'));

for (const file of commandFiles) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
  await initDB();
  setInterval(checkTests, 10 * 1000);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  
  if (!command) return;
  try {
    await command.execute(interaction);
  }
  catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(DISCORD_TOKEN);

export { client };
export type { CommandClient };