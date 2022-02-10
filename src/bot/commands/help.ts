import { CommandInteraction } from 'discord.js';

import { SlashCommandBuilder } from '@discordjs/builders';
import { GUIDELINES_LINK } from '../../configLoader';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Sends practice tournament guidelines document'),
  async execute(interaction: CommandInteraction) {
    await interaction.reply(`${GUIDELINES_LINK}`);
  },
};
