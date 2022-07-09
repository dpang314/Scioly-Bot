import {MessageEmbed, User} from 'discord.js';
import {Test, TournamentEvent, Tournament} from 'scioly-bot-models';
import {client} from '..';

const checkTests = async () => {
  const sendReminder = async (
    user: User | undefined,
    test: Test,
    event: TournamentEvent,
    tournament: Tournament,
  ) => {
    try {
      if (user && test) {
        const reminderEmbed = new MessageEmbed()
          .setColor('RANDOM')
          .setTitle('TIME IS UP! SUBMIT NOW!')
          .setURL(tournament.submission)
          .addFields(
            {name: 'Test', value: event.name},
            {name: 'Private test ID', value: `${test.id}`},
            {
              name: 'Submission link',
              value: `[${tournament.submission}](${tournament.submission})`,
            },
          );

        const DMChannel = await user.createDM();
        DMChannel.send({embeds: [reminderEmbed]});
      } else {
        console.log('Something went wrong in reminders');
      }
    } catch (error) {
      console.log('Something went wrong.');
    }
  };

  const tournaments = await Tournament.findAll({
    include: [
      {
        model: TournamentEvent,
        as: 'tournamentEvents',
        include: [{model: Test, as: 'tests'}],
      },
    ],
  });
  if (!tournaments) return;
  tournaments.forEach(async (tournament) => {
    if (!tournament.tournamentEvents) return;
    tournament.tournamentEvents.forEach(async (event) => {
      if (!event.tests) return;
      event.tests.forEach(async (test) => {
        if (!test.finished) {
          const currentTime = new Date().getTime();
          const testStart = test.timeStarted.getTime();
          const minuteDifference = (currentTime - testStart) / 1000.0 / 60;
          // If time isn't up
          if (minuteDifference < event.minutes) return;
          await test.update({finished: true});
          const user = await client.users.fetch(test.userId);
          await sendReminder(user, test, event, tournament);
          if (test.partner1Id) {
            const partner1 = await client.users.fetch(test.partner1Id);
            await sendReminder(partner1, test, event, tournament);
          }
          if (test.partner2Id) {
            const partner2 = await client.users.fetch(test.partner2Id);
            await sendReminder(partner2, test, event, tournament);
          }
        }
      });
    });
  });
};

export default checkTests;
