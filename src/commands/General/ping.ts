import { ApplyOptions } from '@sapphire/decorators';
import {
  ApplicationCommandRegistry,
  Command,
  CommandOptions,
  RegisterBehavior,
} from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';
import { writeFile } from 'fs/promises';
import { Util } from '../../lib/utils/Util.js';

@ApplyOptions<Command.Options>({
  description: 'Displays latency of the bot',
  chatInputCommand: {
    register: true,
  },
  requiredClientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
})
export class UserCommand extends Command {
  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    async function fetchAllMessages() {
      console.log('fetching...');
      let messages: Message[] = [];

      // Create message pointer
      let message = await interaction.channel?.messages
        .fetch({ limit: 1 })
        .then((messagePage) =>
          messagePage.size === 1 ? messagePage.at(0) : null
        );

      while (message) {
        console.log('fetching more stuff');
        await Util.sleep(1000);
        await interaction.channel?.messages
          .fetch({ limit: 100, before: message.id })
          .then((messagePage) => {
            messagePage.forEach((msg) => {
              if (msg.content !== '' && !message?.author.bot)
                messages.push(msg);
            });

            // Update our message pointer to be last message in page of messages
            message =
              0 < messagePage.size
                ? messagePage.at(messagePage.size - 1)
                : null;
          });
      }

      // console.log(messages); // Print all messages
      const msgJson: { author: string; content: string; createdAt: string }[] =
        [];
      messages.forEach((msg) => {
        if (!msg.author.bot && msg.content !== '')
          msgJson.push({
            author: msg.author.username,
            content: msg.content,
            createdAt: msg.id,
          });
      });
      msgJson.sort((a, b) => parseFloat(a.createdAt) - parseFloat(b.createdAt));
      await writeFile('./messages.json', JSON.stringify(msgJson));
      console.log('finished');
    }
    fetchAllMessages();
    const msg = <Message>await interaction.reply({
      content: 'Ping?',
      fetchReply: true,
    });

    const content = `Pong! Bot Latency ${Math.round(
      this.container.client.ws.ping
    )}ms. API Latency ${
      (msg.editedTimestamp || msg.createdTimestamp) -
      interaction.createdTimestamp
    }ms.`;

    return msg.edit(content);
  }
  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
      },
      {
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ['956774098254594059'],
      }
    );
  }
}
