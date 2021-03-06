import { ApplyOptions } from '@sapphire/decorators';
import {
  ApplicationCommandRegistry,
  Command,
  CommandOptions,
} from '@sapphire/framework';
import { codeBlock, isThenable } from '@sapphire/utilities';
import type { CommandInteraction } from 'discord.js';
import { inspect } from 'util';

@ApplyOptions<CommandOptions>({
  description: 'Evals any JavaScript code',
  preconditions: ['OwnerOnly'],
  requiredClientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
})
export class UserCommand extends Command {
  public async chatInputRun(message: CommandInteraction) {
    const code = message.options.getString('code', true);
    const args = message.options;
    const { result, success } = await this.eval(message, code, {
      async: args.getBoolean('async', false) ?? false,
      depth: Number(args.getInteger('depth')) ?? 0,
      showHidden: args.getBoolean('hidden', false) ?? false,
    });
    const output = success
      ? codeBlock('js', result)
      : `**ERROR**: ${codeBlock('bash', result)}`;

    if (output.length > 2000) {
      return message.replied
        ? message.followUp({
            content: `Output was too long... sent the result as a file.`,
            files: [{ attachment: Buffer.from(output), name: 'output.js' }],
          })
        : message.reply({
            content: `Output was too long... sent the result as a file.`,
            files: [{ attachment: Buffer.from(output), name: 'output.js' }],
          });
    }

    return message.replied
      ? message.followUp({
          content: `${output}`,
          ephemeral: message.options.getBoolean('silent', false) ?? false,
        })
      : message.reply({
          content: `${output}`,
          ephemeral: message.options.getBoolean('silent', false) ?? false,
        });
  }
  public async registerApplicationCommands(i: ApplicationCommandRegistry) {
    i.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((o) =>
            o.setName('code').setRequired(true).setDescription('what to eval')
          )
          .addBooleanOption((o) =>
            o
              .setName('silent')
              .setRequired(false)
              .setDescription('Whether or not to print stdout')
          )
          .addBooleanOption((o) =>
            o
              .setName('hidden')
              .setRequired(false)
              .setDescription('idk what this does')
          )
          .addBooleanOption((o) =>
            o.setName('async').setRequired(false).setDescription('async ftw')
          )
          .addIntegerOption((o) =>
            o.setName('depth').setRequired(false).setDescription('depth')
          ),

      {
        idHints: ['962051338508836894'],
      }
    );
  }
  private async eval(
    message: CommandInteraction,
    code: string,
    flags: { async: boolean; depth: number; showHidden: boolean }
  ) {
    if (flags.async) code = `(async () => {\n${code}\n})();`;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const msg = message,
      i = message,
      interaction = message;

    let success = true;
    let result = null;

    try {
      // eslint-disable-next-line no-eval
      result = eval(code);
    } catch (error) {
      if (error && error instanceof Error && error.stack) {
        this.container.client.logger.error(error);
      }
      result = error;
      success = false;
    }

    if (isThenable(result)) result = await result;

    if (typeof result !== 'string') {
      result = inspect(result, {
        depth: flags.depth,
        showHidden: flags.showHidden,
      });
    }

    return { result, success };
  }
}
