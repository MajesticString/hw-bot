import { ApplyOptions } from '@sapphire/decorators';
import {
  ApplicationCommandRegistry,
  Command,
  CommandOptions,
  RegisterBehavior,
} from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
  description: 'Displays latency of the bot',
  chatInputCommand: {
    register: true,
  },
})
export class UserCommand extends Command {
  public async chatInputRun(interaction: CommandInteraction) {
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
