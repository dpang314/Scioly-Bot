import { CommandInteraction, Message, MessageActionRow, MessageSelectMenu, SelectMenuInteraction, User, MessageButton, MessageEmbed } from "discord.js";

import { SlashCommandBuilder } from '@discordjs/builders';

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import { TestModel, Test } from "../db";
import { SUBMISSION_LINK, TEST_OPTIONS } from "../configLoader";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Start a test')
    .addUserOption(option => option.setName('partner1').setDescription('Partner 1'))
    .addUserOption(option => option.setName('partner2').setDescription('Partner 2 (only used in some events)')),
  async execute(interaction: CommandInteraction) {
    const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('testSelect')
					.setPlaceholder('Nothing selected')
					.addOptions(TEST_OPTIONS),
			);
      const button = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('confirm')
					.setLabel('Confirm')
					.setStyle('PRIMARY')
          .setDisabled(true),
        new MessageButton()
          .setCustomId('cancel')
          .setLabel('Cancel')
          .setStyle('DANGER')
          .setDisabled(true),
			);
      await interaction.reply({ content: 'Select test from the dropdown', components: [row, button] });
      const message = await interaction.fetchReply() as Message;
      
      const filter = async (i: SelectMenuInteraction) => {
        if (i.user.id !== interaction.user.id) {
          i.reply({ content: 'This is not for you.', ephemeral: true });
          return false;
        } else {
          i.deferUpdate();
          return i.user.id === interaction.user.id;
        }
      }

      try {
        const i = await message.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 60000 });
       
        const test: Test = {
          user_id: interaction.user.id,
          test_name: i.values[0],
          time_started: dayjs().toDate(),
          finished: false,
        };

        const partner1 = interaction.options.getUser('partner1');
        const partner2 = interaction.options.getUser('partner2');
        let userConfirmed = false;
        let partner1Confirmed = false;
        let partner2Confirmed = false;
        const foundTest = TEST_OPTIONS.find(element => element.value === i.values[0]);

        const confirmedMessage = (): string => {
          let response = `Confirmed users for ${foundTest?.label}:\n${interaction.user.toString()} ${userConfirmed ? ':white_check_mark:' : ':x:'}\n `;
          if (partner1){
            response += `${partner1.toString()} ${partner1Confirmed ? ':white_check_mark:' : ':x:'}\n`;
          }
          if (partner2) {
            response += `${partner2.toString()} ${partner2Confirmed ? ':x:' : ''}\n`;
          }
          return response;
        }
        
        if (partner1) {
          test.partner1_id = partner1.id;
        }
        if (partner2) {
          test.partner2_id = partner2.id;
        }

        button.components.forEach(button => button.setDisabled(false));
        interaction.editReply({ content: confirmedMessage(), components: [button]});

        const buttonCollector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });

        buttonCollector.on('collect', async(buttonInteraction) => {
          let validUser = false;
          if (buttonInteraction.user.id === interaction.user.id) {
            validUser = true;
            if (buttonInteraction.customId === 'confirm') {
              userConfirmed = true;
              buttonInteraction.reply({ content: 'Confirmed!', ephemeral: true });
              await message.edit(confirmedMessage());
            } else {
              buttonInteraction.reply({ content: 'Canceled.', ephemeral: true });
              interaction.editReply({ content: 'Test canceled', components: [] });
              buttonCollector.stop();
            }       
          }
          if (partner1 && buttonInteraction.user.id === partner1.id) {
            validUser = true;
            if (buttonInteraction.customId === 'confirm') {
              partner1Confirmed = true;
              buttonInteraction.reply({ content: 'Confirmed!', ephemeral: true });
              await message.edit(confirmedMessage());
            } else {
              buttonInteraction.reply({ content: 'Canceled.', ephemeral: true });
              interaction.editReply({ content: 'Test canceled', components: [] });
              buttonCollector.stop();
            } 
          }
          if (partner2 && buttonInteraction.user.id === partner2.id) {
            validUser = true;
            if (buttonInteraction.customId === 'confirm') {
              partner2Confirmed = true;
              buttonInteraction.reply({ content: 'Confirmed!', ephemeral: true });
              await message.edit(confirmedMessage());
            } else {
              buttonInteraction.reply({ content: 'Canceled.', ephemeral: true });
              interaction.editReply({ content: 'Test canceled', components: [] });
              buttonCollector.stop();
            } 
          }
          if (!validUser) {
            await buttonInteraction.reply({ content: `This isn't for you!`, ephemeral: true });
          }
          if (userConfirmed && (partner1 === null || partner1Confirmed) && (partner2 === null) || partner2Confirmed) {
            const createdTest = await TestModel.create(test);

            const sendTest = async(user: User, name: string) => {
              try {
                const testEmbed = new MessageEmbed()
                  //.setColor('#0099ff')
                  .setColor('RANDOM')
                  .setTitle(foundTest!.label)
                  .setURL(foundTest!.link)
                  .setDescription(`Only one partner should submit the test\nYou have 25 minutes. Good luck!`)
                  .addFields(
                    { name: 'Test link', value: `[${foundTest?.link}](${foundTest?.link})`},
                    { name: 'Private test ID', value: `${createdTest._id}` },
                    { name: 'Submission link', value: `[${SUBMISSION_LINK}](${SUBMISSION_LINK})`}
                  );
                const DMChannel = await user.createDM();
                DMChannel.send({ embeds: [testEmbed] });
              } catch(error) {
                await message.edit(`Something went wrong sending test to ${name}`);
              }
            }

            sendTest(interaction.user, 'you');
            
            if (partner1) {
              sendTest(partner1, 'partner 1');
            }
            
            if (partner2) {
              sendTest(partner2, 'partner 2');
            }
            await interaction.editReply({ content: `Tests sent to ${interaction.user.toString()} ${partner1 ? `, ${partner1.toString()}` : ''} ${partner2 ? `, ${partner2.toString()}` : ''}`, components: []});
          }
        });
      } catch(error) {
        await message.edit('Test failed');
      }
  },
};