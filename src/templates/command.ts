import { ApplyOptions } from '@sapphire/decorators';
import {
  ApplicationCommandRegistry,
  Command,
  CommandOptions,
  RegisterBehavior,
} from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
  name: '{{name}}',
  description: '',
  chatInputCommand: {
    register: true,
  },
})
export class UserCommand extends Command {
  public async chatInputRun(interaction: CommandInteraction) {
    interaction.reply('Hello World!');
  }
  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      (builder) => builder.setName(this.name).setDescription(this.description),
      {
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        registerCommandIfMissing: true,
      }
    );
  }
}
