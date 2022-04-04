import { Client, TextInputStyle } from 'discord.js14';
import config from './config.js';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from 'builders14';
import {
  addAssignment,
  normalizeGrade,
  Subjects,
} from './lib/utils/firestore.js';

const client = new Client({
  intents: [
    'Guilds',
    'GuildEmojisAndStickers',
    'DirectMessages',
    'DirectMessageReactions',
  ],
});

client.on('interactionCreate', (interaction) => {
  if (interaction.isChatInputCommand()) {
    switch (interaction.commandName) {
      case 'add':
        if (interaction.options.getBoolean('use-modal', false))
          interaction.showModal(
            new ModalBuilder()
              .setTitle('Add Assignment')
              .setCustomId('add-assignment-modal')
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setLabel('Assignment Name')
                    .setCustomId('assignment-name')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setLabel('Grade')
                    .setCustomId('grade')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setLabel('Subject')
                    .setCustomId('subject')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setLabel('Due Date')
                    .setCustomId('due-date')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setPlaceholder('yyyy/mm/dd')
                    .setMinLength(4)
                ),
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setLabel('Description')
                    .setCustomId('description')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setPlaceholder(
                      'Maybe some assignment instructions or location of the assignment.'
                    )
                )
              )
          );
        break;

      default:
        break;
    }
  } else if (interaction.isModalSubmit()) {
    const getModalFieldValue = (fieldName: string) =>
      interaction.fields.fields.get(fieldName)!.value;
    switch (interaction.customId) {
      case 'add-assignment-modal':
        if (
          normalizeGrade(getModalFieldValue('grade'), 'number') < 9 ||
          normalizeGrade(getModalFieldValue('grade'), 'number') > 12
        )
          return interaction.reply(
            'Invalid Grade: Grade must be between 9 and 12'
          );
        if (
          getModalFieldValue('subject').toLowerCase() !== 'math' &&
          getModalFieldValue('subject').toLowerCase() !== 'science' &&
          getModalFieldValue('subject').toLowerCase() !== 'english' &&
          getModalFieldValue('subject').toLowerCase() !== 'history'
        ) {
          return interaction.reply(
            'Invalid Subject: Subject must be one of the following: math, science, english, history'
          );
        }
        addAssignment(
          getModalFieldValue('assignment-name'),
          normalizeGrade(getModalFieldValue('grade'), 'number'),
          <Subjects>getModalFieldValue('subject').toLowerCase(),
          getModalFieldValue('due-date').replaceAll('/', '-'),
          getModalFieldValue('description')
        ).then((data) => {
          interaction.reply({
            embeds: [
              {
                title: 'Successfully Created Assignment',
                fields: [
                  {
                    name: 'Assignment Name',
                    value: getModalFieldValue('assignment-name'),
                  },
                  { name: 'Grade', value: getModalFieldValue('grade') },
                  { name: 'Subject', value: getModalFieldValue('subject') },
                  { name: 'Due Date', value: getModalFieldValue('due-date') },
                  {
                    name: 'Description',
                    value: getModalFieldValue('description'),
                  },
                ],
              },
            ],
          });
        });
        break;

      default:
        break;
    }
  }
});

client.login(config.discordToken);
