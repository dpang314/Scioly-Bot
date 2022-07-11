import {CommandInteraction, MessageEmbed} from 'discord.js';

import {SlashCommandBuilder} from '@discordjs/builders';
import {Test, TournamentEvent} from 'scioly-bot-models';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('time')
    .setDescription('Sends time left on current test(s).'),
  async execute(interaction: CommandInteraction) {
    const tests = await Test.findAll({
      where: {userId: interaction.user.id, finished: false},
      include: [{model: TournamentEvent, as: 'tournamentEvent'}],
    });
    tests.concat(
      await Test.findAll({
        where: {partner1Id: interaction.user.id, finished: false},
        include: [{model: TournamentEvent, as: 'tournamentEvent'}],
      }),
    );
    tests.concat(
      await Test.findAll({
        where: {partner2Id: interaction.user.id, finished: false},
        include: [{model: TournamentEvent, as: 'tournamentEvent'}],
      }),
    );
    const testsEmbed = new MessageEmbed()
      .setColor('RANDOM')
      .setTitle('Current tests');
    for (let i = 0; i < tests.length; i += 1) {
      const test = tests[i];
      if (test) {
        const currentTime = new Date().getTime();
        const testStart = test.timeStarted.getTime();
        let secondDifference = (currentTime - testStart) / 1000.0;
        const minuteDifference = Math.floor(secondDifference / 60.0);
        secondDifference -= minuteDifference * 60;
        testsEmbed.addField(
          test.tournamentEvent.name,
          `${test.tournamentEvent.minutes - minuteDifference - 1} ${
            test.tournamentEvent.minutes - minuteDifference - 1 === 1
              ? 'minute'
              : 'minutes'
          }. ${Math.floor(60 - secondDifference)} ${
            Math.floor(60 - secondDifference) === 1 ? 'second' : 'seconds'
          }`,
        );
      }
    }
    await interaction.reply({embeds: [testsEmbed]});
  },
};
