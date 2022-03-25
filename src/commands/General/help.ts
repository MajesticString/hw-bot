import { ApplyOptions } from '@sapphire/decorators';
import {
  ApplicationCommandRegistry,
  Command,
  CommandOptions,
  RegisterBehavior,
} from '@sapphire/framework';
import type { CommandInteraction, EmbedField } from 'discord.js';

@ApplyOptions<CommandOptions>({
  description: 'Displays commands',
  chatInputCommand: {
    register: true,
  },
  aliases: ['commands'],
})
export class UserCommand extends Command {
  public async chatInputRun(interaction: CommandInteraction) {
    const fields: EmbedField[] = [];
    this.container.stores.get('commands').forEach((cmd) => {
      fields.push({
        name: cmd.name,
        value: `**Description:** ${cmd.description}
**Category:** ${cmd.category}
**Aliases:** ${cmd.aliases}`,
        inline: true,
      });
    });
    interaction.reply({
      embeds: [
        {
          title: 'Commands',
          fields,
        },
      ],
    });
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
        idHints: ['956774097906462730'],
      }
    );
  }
}
