import { Client, TextInputStyle } from 'discord.js14';
import config from './config.js';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from 'builders14';

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
                    .setPlaceholder('mm/dd/yy')
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
  }
  // Wont work until this is merged: https://github.com/discordjs/discord.js/pull/7649
  else if (interaction.isModalSubmit()) {
    switch (interaction.customId) {
      case 'add-assignment-modal':
        console.log(interaction.fields.fields.get('assignment-name')?.value);
        break;

      default:
        break;
    }
  }
});

client.login(config.discordToken);
