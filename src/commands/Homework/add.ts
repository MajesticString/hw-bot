import { ApplyOptions } from '@sapphire/decorators';
import {
  ApplicationCommandRegistry,
  Command,
  CommandOptions,
  RegisterBehavior,
} from '@sapphire/framework';

@ApplyOptions<CommandOptions>({
  name: 'add',
  description: 'Adds an assignment to the homework list',
  requiredClientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
})
export class UserCommand extends Command {
  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    if (!interaction.options.getBoolean('use-modal', false)) {
    }
  }
  public async registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addBooleanOption((i) =>
            i
              .setRequired(false)
              .setName('use-modal')
              .setDescription('Whether to use builtin modals')
          ),
      {
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        registerCommandIfMissing: true,
      }
    );
  }
}
