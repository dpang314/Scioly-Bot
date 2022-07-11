import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageSelectMenu,
  SelectMenuInteraction,
  User as DiscordUser,
  MessageButton,
  MessageEmbed,
} from 'discord.js';

import {SlashCommandBuilder} from '@discordjs/builders';

import {TestCreationAttributes} from 'scioly-bot-types';
import {Tournament, TournamentEvent, User} from 'scioly-bot-models';

const getTournament = async (interaction: CommandInteraction) => {
  // TODO switch to manually setting available servers for more efficient tournament retrieval
  const members = await interaction.guild?.members.list();
  if (!members) {
    await interaction.reply('No tournaments');
    return null;
  }
  const tournaments: Tournament[] = [];
  for (const member of members) {
    if (member[1].permissions.has('ADMINISTRATOR')) {
      const administrator = await User.findByPk(member[1].id, {
        include: [{model: Tournament, as: 'tournaments'}],
      });
      if (administrator && administrator.tournaments) {
        tournaments.push(...administrator.tournaments);
      }
    }
  }
  if (tournaments.length === 0) {
    await interaction.reply('No tournaments');
    return null;
  }
  const tournamentOptions: {label: string; value: string}[] = [];
  for (let i = 0; i < tournaments.length; i += 1) {
    tournamentOptions.push({
      label: tournaments[i].name,
      value: tournaments[i].id,
    });
  }
  const filter = async (i: SelectMenuInteraction) => {
    if (i.user.id !== interaction.user.id) {
      i.reply({content: 'This is not for you.', ephemeral: true});
      return false;
    }
    i.deferUpdate();
    return i.user.id === interaction.user.id;
  };

  const tournamentSelect = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId('tournamentSelect')
      .setPlaceholder('Nothing selected')
      .addOptions(tournamentOptions),
  );
  await interaction.reply({
    content: 'Select a tournament from the dropdown',
    components: [tournamentSelect],
  });
  const message = (await interaction.fetchReply()) as Message;
  try {
    const i = await message.awaitMessageComponent({
      filter,
      componentType: 'SELECT_MENU',
      time: 60000,
    });
    const tournament = await Tournament.findOne({
      where: {id: i.values[0]},
      include: [{model: TournamentEvent, as: 'tournamentEvents'}],
    });
    return tournament;
  } catch (error) {
    await message.edit('Tournament select failed. Try running /test again.');
    return null;
  }
};

const getEvent = async (
  interaction: CommandInteraction,
  tournament: Tournament,
) => {
  const events = tournament.tournamentEvents;
  const eventOptions: {label: string; value: string}[] = [];
  if (events) {
    for (let i = 0; i < events.length; i += 1) {
      eventOptions.push({label: events[i].name, value: events[i].id});
    }

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('eventSelect')
        .setPlaceholder('Nothing selected')
        .addOptions(eventOptions),
    );
    const message = (await interaction.editReply({
      content: 'Select event from the dropdown',
      components: [row],
    })) as Message;

    const filter = async (i: SelectMenuInteraction) => {
      if (i.user.id !== interaction.user.id) {
        i.followUp({content: 'This is not for you.', ephemeral: true});
        return false;
      }
      i.deferUpdate();
      return i.user.id === interaction.user.id;
    };

    try {
      const i = await message.awaitMessageComponent({
        filter,
        componentType: 'SELECT_MENU',
        time: 60000,
      });
      const foundTest = events.find(
        (event) => event.id === i.values[0],
      ) as TournamentEvent;
      await message.edit(`Event: ${foundTest.name}`);
      return foundTest;
    } catch (error) {
      await message.edit('Test failed');
      return null;
    }
  } else {
    await interaction.editReply('Tournament has no events.');
    return null;
  }
};

const confirm = async (
  interaction: CommandInteraction,
  tournament: Tournament,
  event: TournamentEvent,
) => {
  const testAttributes: TestCreationAttributes = {
    userId: interaction.user.id,
    finished: false,
  };

  const partner1 = interaction.options.getUser('partner1');
  const partner2 = interaction.options.getUser('partner2');

  if (partner1) {
    testAttributes.partner1Id = partner1.id;
  }

  if (partner2) {
    testAttributes.partner2Id = partner2.id;
  }

  let userConfirmed = false;
  let partner1Confirmed = false;
  let partner2Confirmed = false;

  const confirmedMessage = (): MessageEmbed => {
    const embed = new MessageEmbed()
      .setColor('RANDOM')
      .setTitle(tournament.name)
      .setDescription(event.name)
      .addField(
        `${interaction.user.username} ${
          userConfirmed ? ':white_check_mark:' : ':x:'
        }\n`,
        '\u200B',
      );

    if (partner1) {
      embed.addField(
        `${partner1.username} ${
          partner1Confirmed ? ':white_check_mark:' : ':x:'
        }\n`,
        '\u200B',
      );
    }

    if (partner2) {
      embed.addField(
        `${partner2.username} ${
          partner2Confirmed ? ':white_check_mark:' : ':x:'
        }\n`,
        '\u200B',
      );
    }

    return embed;
  };

  const buttons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId('confirm')
      .setLabel('Confirm')
      .setStyle('PRIMARY'),
    new MessageButton()
      .setCustomId('cancel')
      .setLabel('Cancel')
      .setStyle('DANGER'),
  );

  let mentions = `${interaction.user.toString()} `;
  if (partner1) mentions += `${partner1.toString()} `;
  if (partner2) mentions += partner2.toString();

  const message = (await interaction.editReply({
    content: mentions,
    embeds: [confirmedMessage()],
    components: [buttons],
  })) as Message;
  const buttonCollector = message.createMessageComponentCollector({
    componentType: 'BUTTON',
    time: 60000,
  });

  buttonCollector.on('collect', async (buttonInteraction) => {
    let validUser = false;
    if (
      buttonInteraction.user.id === interaction.user.id ||
      (partner1 && buttonInteraction.user.id === partner1.id) ||
      (partner2 && buttonInteraction.user.id === partner2.id)
    ) {
      validUser = true;
      if (buttonInteraction.customId === 'confirm') {
        await buttonInteraction.reply({content: 'Confirmed!', ephemeral: true});
        if (buttonInteraction.user.id === interaction.user.id)
          userConfirmed = true;
        if (partner1 && buttonInteraction.user.id === partner1.id)
          partner1Confirmed = true;
        if (partner2 && buttonInteraction.user.id === partner2.id)
          partner2Confirmed = true;
        await message.edit({embeds: [confirmedMessage()]});
      } else {
        await buttonInteraction.reply({content: 'Canceled.', ephemeral: true});
        await message.edit({content: 'Test canceled', components: []});
        buttonCollector.stop();
      }
    }

    if (!validUser) {
      await buttonInteraction.reply({
        content: "This isn't for you!",
        ephemeral: true,
      });
    }
    if (
      userConfirmed &&
      (partner1 === null || partner1Confirmed) &&
      (partner2 === null || partner2Confirmed)
    ) {
      const test = await event.createTest(testAttributes);

      const sendTest = async (user: DiscordUser, name: string) => {
        try {
          const testEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(event.name)
            .setURL(event.link)
            .setDescription(
              `Only one partner should submit the test\nYou have ${
                event.minutes
              } ${event.minutes === 1 ? 'minute' : 'minutes'}. Good luck!`,
            )
            .addFields(
              {name: 'Test link', value: `[${event.link}](${event.link})`},
              {name: 'Private test ID', value: `${test.id}`},
              {
                name: 'Submission link',
                value: `[${tournament.submission}](${tournament.submission})`,
              },
            );
          const DMChannel = await user.createDM();
          DMChannel.send({embeds: [testEmbed]});
        } catch (error) {
          await message.edit(`Something went wrong sending test to ${name}`);
        }
      };

      sendTest(interaction.user, 'you');

      if (partner1) {
        sendTest(partner1, 'partner 1');
      }

      if (partner2) {
        sendTest(partner2, 'partner 2');
      }
      await interaction.editReply({
        content: `Tests sent to ${interaction.user.toString()} ${
          partner1 ? `, ${partner1.toString()}` : ''
        } ${partner2 ? `, ${partner2.toString()}` : ''}`,
        components: [],
      });
    }
  });
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Start a test')
    .addUserOption((option) =>
      option.setName('partner1').setDescription('Partner 1'),
    )
    .addUserOption((option) =>
      option
        .setName('partner2')
        .setDescription('Partner 2 (only used in some events)'),
    ),
  async execute(interaction: CommandInteraction) {
    const tournament = await getTournament(interaction);
    if (tournament) {
      const event = await getEvent(interaction, tournament);
      if (event) {
        await confirm(interaction, tournament, event);
      }
    }
  },
};
