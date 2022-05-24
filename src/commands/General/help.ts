import { ApplyOptions } from '@sapphire/decorators';
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from '@sapphire/framework';
import { createHelpCommand } from 'discord-help-command-creator';

@ApplyOptions<Command.Options>({
  description: 'Displays commands',
  aliases: ['commands'],
  requiredClientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
})
export class UserCommand extends Command {
  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    createHelpCommand(this.container.stores.get('commands'), interaction);
    this.container.client.emit('interaction-create');
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
