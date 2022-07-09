import {CommandInteraction} from 'discord.js';

import {SlashCommandBuilder} from '@discordjs/builders';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Sends practice tournament guidelines document'),
  async execute(interaction: CommandInteraction) {
    // TODO create more descriptive help command
    await interaction.reply('Run /test or /time');
  },
};
