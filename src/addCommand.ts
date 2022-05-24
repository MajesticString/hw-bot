// @ts-nocheck
import {
  addAssignment,
  addReputation,
  Subjects,
} from '#lib/utils/firestore.js';
import { Util } from '#lib/utils/Util.js';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from 'builders14';
import { Message } from 'discord.js';
import { Client, TextInputStyle } from 'discord.js14';
import config from './config.js';
import {
  ConfirmationMessage,
  disableAllComponents,
} from './lib/utils/interactions.js';

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
        interaction.showModal(
          new ModalBuilder()
            .setTitle('Add Assignment')
            .setCustomId('add-assignment-modal')
            .addComponents(
              new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                  .setLabel('Assignment Name')
                  .setCustomId('assignment-name')
                  .setStyle(TextInputStyle.Short)
                  .setRequired(true)
              ),
              new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                  .setLabel('Grade')
                  .setCustomId('grade')
                  .setStyle(TextInputStyle.Short)
                  .setRequired(true)
              ),
              new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                  .setLabel('Subject')
                  .setCustomId('subject')
                  .setStyle(TextInputStyle.Short)
                  .setRequired(true)
              ),
              new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                  .setLabel('Due Date')
                  .setCustomId('due-date')
                  .setStyle(TextInputStyle.Short)
                  .setRequired(true)
                  .setPlaceholder('dd/mm/yyyy')
                  .setMinLength(4)
              ),
              new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                  .setLabel('Description')
                  .setCustomId('description')
                  .setStyle(TextInputStyle.Paragraph)
                  .setRequired(false)
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
          Util.normalizeGrade(getModalFieldValue('grade'), 'number') < 9 &&
          Util.normalizeGrade(getModalFieldValue('grade'), 'number') > 12 &&
          Util.normalizeGrade(getModalFieldValue('grade'), 'number') !==
            Math.round(
              Util.normalizeGrade(getModalFieldValue('grade'), 'number')
            )
        )
          return interaction.reply(
            'Invalid Grade: Grade must be between 9 and 12'
          );
        if (isNaN(new Date(getModalFieldValue('due-date')).getTime()))
          return interaction.reply(
            'Invalid date. Date must be a parsable date. Try again in the format yyyy/mm/dd'
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
        new ConfirmationMessage(<any>interaction, {
          title: 'Is this information correct?',
          fields: [
            {
              name: 'Assignment Name',
              value: getModalFieldValue('assignment-name'),
            },
            { name: 'Grade', value: getModalFieldValue('grade') },
            { name: 'Subject', value: getModalFieldValue('subject') },
            {
              name: 'Due Date',
              value: new Date(getModalFieldValue('due-date')).toDateString(),
            },
            {
              name: 'Description',
              value: getModalFieldValue('description') || 'None provided',
            },
          ],
        })
          .on('confirm', (i) => {
            addAssignment(
              getModalFieldValue('assignment-name'),
              Util.normalizeGrade(getModalFieldValue('grade'), 'number'),
              <Subjects>getModalFieldValue('subject').toLowerCase(),
              getModalFieldValue('due-date').replaceAll('/', '-'),
              getModalFieldValue('description') || 'None provided',
              interaction.user.id
            ).then(() => {
              console.log('confirmed');

              const rep = addReputation(interaction.user.id, 1);
              interaction.reply({
                embeds: [
                  {
                    title: 'Successfully Created Assignment',
                    description:
                      'Also added 1 reputation. You now have ' +
                      rep +
                      ' reputation.',
                    fields: [
                      {
                        name: 'Assignment Name',
                        value: getModalFieldValue('assignment-name'),
                      },
                      { name: 'Grade', value: getModalFieldValue('grade') },
                      { name: 'Subject', value: getModalFieldValue('subject') },
                      {
                        name: 'Due Date',
                        value: new Date(
                          getModalFieldValue('due-date')
                        ).toDateString(),
                      },
                      {
                        name: 'Description',
                        value:
                          getModalFieldValue('description') || 'None provided',
                      },
                    ],
                  },
                ],
              });
            });
          })
          .on('deny', (i) => {
            i.reply('Canceled');
            disableAllComponents(interaction.message as unknown as Message);
          });

        break;

      default:
        break;
    }
  }
});

client.login(config.discordToken);
