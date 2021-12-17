import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import { TestModel, Test } from "../db";
import { client } from '../index';
import { MessageEmbed, User } from 'discord.js';
import { SUBMISSION_LINK, TEST_LENGTH } from '../configLoader';
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
  
  const tests: Array<Test> = await TestModel.find({ finished: false });
  for (const test of tests) {
    const currentTime = dayjs();
    const testStart = dayjs(test.time_started);
    const minuteDifference = currentTime.diff(testStart) / 1000 / 60;
    if (minuteDifference >= TEST_LENGTH && minuteDifference < TEST_LENGTH + 1) {
      await TestModel.findByIdAndUpdate(test.id, { finished: true })
      const user = await client.users.fetch(test.user_id);
      sendReminder(user, test._id);
      if (test.partner1_id) {
        const partner1 = await client.users.fetch(test.partner1_id)
        sendReminder(partner1, test._id);
      }
      if (test.partner2_id) {
        const partner2 = await client.users.fetch(test.partner2_id)
        sendReminder(partner2, test._id);
      }
    }
  }
}

export default checkTests;