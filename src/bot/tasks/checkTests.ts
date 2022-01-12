import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import { Test, TestInstance } from "../../models";
import { client } from '../index';
import { MessageEmbed, User } from 'discord.js';
import { SUBMISSION_LINK, TEST_LENGTH } from '../../configLoader';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

const checkTests = async() => {
  const sendReminder = async(user: User | undefined, id: string | undefined) => {
    try {
      if (user && id) {
        const reminderEmbed = new MessageEmbed()
          .setColor('RANDOM')
          //.setColor('#0099ff')
          .setTitle('TIME IS UP! SUBMIT NOW!')
          .setURL(SUBMISSION_LINK)
          .addFields(
            { name: 'Private test ID', value: `${id}` },
            { name: 'Submission link', value: `[${SUBMISSION_LINK}](${SUBMISSION_LINK})`}
          );

        const DMChannel = await user.createDM();
        DMChannel.send({ embeds: [reminderEmbed] });
      } else {
        console.log('Something went wrong in reminders');
      }
    } catch(error) {
      console.log('Something went wrong.')
    }
  }
  
  const tests = await Test.findAll({ where: { finished: false } });
  for (const test of tests) {
    const currentTime = dayjs();
    const testStart = dayjs(test._attributes.time_started);
    const minuteDifference = currentTime.diff(testStart) / 1000 / 60;
    if (minuteDifference >= TEST_LENGTH && minuteDifference < TEST_LENGTH + 1) {
      await Test.update({ finished: true }, { where: { id: test._attributes.id } });
      const user = await client.users.fetch(test._attributes.user_id);
      sendReminder(user, test._attributes.id);
      if (test._attributes.partner1_id) {
        const partner1 = await client.users.fetch(test._attributes.partner1_id)
        sendReminder(partner1, test._attributes.id);
      }
      if (test._attributes.partner2_id) {
        const partner2 = await client.users.fetch(test._attributes.partner2_id)
        sendReminder(partner2, test._attributes.id);
      }
    }
  }
}

export default checkTests;