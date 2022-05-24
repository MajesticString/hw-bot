import { ApplyOptions } from '@sapphire/decorators';
import { getUser } from '#utils/firestore.js';
import {
  ApplicationCommandRegistry,
  Command,
  CommandOptions,
  RegisterBehavior,
} from '@sapphire/framework';
import type { CommandInteraction, ContextMenuInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
  name: 'profile',
  description: 'Shows general info about a user',
  requiredClientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
})
export class UserCommand extends Command {
  public async chatInputRun(interaction: CommandInteraction) {
    this.respond(interaction);
  }

  public async contextMenuRun(interaction: ContextMenuInteraction) {
    this.respond(interaction);
  }

  private async respond(
    interaction: CommandInteraction | ContextMenuInteraction
  ) {
    const userArg =
      interaction.options.getUser('user', false) ?? interaction.user;
    const user = await getUser(userArg.id);

    interaction.reply({
      embeds: [
        {
          title: userArg.tag,
          fields: [
            {
              name: 'Reputation',
              value:
                user?.reputation.toString() +
                ' (you can gain reputation by suggesting homework using the `/add` command)',
            },
          ],
        },
      ],
    });
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addUserOption((i) =>
            i
              .setName('user')
              .setDescription('The user to get. Defaults to you.')
              .setRequired(false)
          ),
      {
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ['956774099034734602', '956774099273801780'],
      }
    );

    registry.registerContextMenuCommand({
      name: this.name,
      type: 'USER',
    });
  }
}
