import { CommandInteraction, Message } from 'discord.js';

export class Util {
  /**
   * @function sleep
   * @param {Number} ms The amount of milliseconds to wait
   * @returns {Promise<void>} An empty promise that will be resolved when the given ms are elapsed
   */
  static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
