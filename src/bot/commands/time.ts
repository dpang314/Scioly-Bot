import { CommandInteraction, MessageEmbed } from 'discord.js';

import { SlashCommandBuilder } from '@discordjs/builders';
import db from '../../models';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('time')
    .setDescription('Sends time left on current test(s).'),
  async execute(interaction: CommandInteraction) {
    const tests = await db.Test.findAll({ where: { userId: interaction.user.id, finished: false }, include: [{ model: db.TournamentEvent, as: 'tournamentEvent' }] });
    tests.concat(await db.Test.findAll({ where: { partner1Id: interaction.user.id, finished: false }, include: [{ model: db.TournamentEvent, as: 'tournamentEvent' }] }));
    tests.concat(await db.Test.findAll({ where: { partner2Id: interaction.user.id, finished: false }, include: [{ model: db.TournamentEvent, as: 'tournamentEvent' }] }));
    const testsEmbed = new MessageEmbed()
      .setColor('RANDOM')
      .setTitle('Current tests');
    for (let i = 0; i < tests.length; i += 1) {
      const test = tests[i];
      if (test) {
        const currentTime = new Date().getTime();
        const testStart = test.timeStarted.getTime();
        const minuteDifference = (currentTime - testStart) / 1000.0 / 60;
        testsEmbed.addField(test.tournamentEvent.name, `${(test.tournamentEvent.minutes - minuteDifference).toFixed(2)} minutes`);
      }
    }
    await interaction.reply({ embeds: [testsEmbed] });
  },
};
