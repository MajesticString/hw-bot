import type {
  Events,
  ChatInputCommandDeniedPayload,
} from '@sapphire/framework';
import { Listener, UserError } from '@sapphire/framework';

export class UserEvent extends Listener<typeof Events.ChatInputCommandDenied> {
  public async run(
    { context, message: content }: UserError,
    { interaction }: ChatInputCommandDeniedPayload
  ) {
    // `context: { silent: true }` should make UserError silent:
    // Use cases for this are for example permissions error when running the `eval` command.
    if (Reflect.get(Object(context), 'silent')) return;

    return interaction.reply({
      content,
      ephemeral:
        !interaction.guild?.me
          ?.permissionsIn(interaction.channelId)
          .has('EMBED_LINKS') ||
        !interaction.guild?.me
          ?.permissionsIn(interaction.channelId)
          .has('SEND_MESSAGES'),
      allowedMentions: { users: [interaction.user.id], roles: [] },
    });
  }
}
