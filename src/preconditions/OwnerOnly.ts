import { Precondition } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';
import config from '../config.js';

const OWNERS = config.owners;

export class UserPrecondition extends Precondition {
  public async chatInputRun(message: CommandInteraction) {
    return OWNERS.includes(message.user.id)
      ? this.ok()
      : this.error({ message: 'This command can only be used by the owner.' });
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    OwnerOnly: never;
  }
}
