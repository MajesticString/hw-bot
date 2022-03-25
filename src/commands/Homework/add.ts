import { ApplyOptions } from '@sapphire/decorators';
import {
  ApplicationCommandRegistry,
  Command,
  CommandOptions,
} from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
  name: 'add',
  description: 'Adds an assignment to the homework list',
})
export class UserCommand extends Command {
  public async chatInputRun(interaction: CommandInteraction) {
    interaction.reply('Hello World!');
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
        idHints: ['956774100154585139'],
      }
    );
  }
}
