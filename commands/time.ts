import { CommandInteraction, MessageEmbed } from "discord.js";

import { SlashCommandBuilder } from '@discordjs/builders';
import { TEST_LENGTH, TEST_OPTIONS } from "../configLoader";
import { TestModel } from "../db";

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('time')
    .setDescription('Sends time left on current test(s). Hopefully your\'e only taking one test at a time.'),
  async execute(interaction: CommandInteraction) {
    const tests = await TestModel.find({ user_id: interaction.user.id });
    const testsEmbed = new MessageEmbed()
    .setColor('RANDOM')
    //.setColor('#0099ff')
    .setTitle('Current tests');
    for (const test of tests) {
      const currentTime = dayjs();
      const testStart = dayjs(test.time_started);
      const minuteDifference = currentTime.diff(testStart) / 1000 / 60;
      if (!test.finished) {
        const testLabel = TEST_OPTIONS.find(element => element.value === test.test_name)?.label;
        if (testLabel) {
          testsEmbed.addField(testLabel, `${(TEST_LENGTH - minuteDifference).toFixed(2)} minutes`);
        }
      }
    }
    await interaction.reply({ embeds: [testsEmbed] });
  },
};