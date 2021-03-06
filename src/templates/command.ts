import { ApplyOptions } from '@sapphire/decorators';
import {
  ApplicationCommandRegistry,
  CommandOptions,
  RegisterBehavior,
} from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { HwCommand } from '../lib/HwCommand.js';

@ApplyOptions<CommandOptions>({
  name: '{{name}}',
  description: '',
})
export class UserCommand extends HwCommand {
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
