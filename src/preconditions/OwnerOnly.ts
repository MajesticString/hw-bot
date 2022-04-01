import { Command, Precondition } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import config from '../config.js';

const OWNERS = config.owners;

export class UserPrecondition extends Precondition {
  public async chatInputRun(message: CommandInteraction, command: Command) {
    return OWNERS.includes(message.user.id)
      ? this.ok()
      : this.#sendErrorMessage(message);
  }
  #sendErrorMessage(message: CommandInteraction) {
    message.reply('This command can only be used by the owner.');
    return this.error({
      message: 'This command can only be used by the owner.',
    });
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    OwnerOnly: never;
  }
}
