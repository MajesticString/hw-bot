import { Args, Command, PieceContext } from '@sapphire/framework';
import { Awaitable, ModalSubmitInteraction } from 'discord.js';

export class HwCommand<
  PreParseReturn = Args,
  O extends Command.Options = Command.Options
> extends Command<PreParseReturn, O> {
  constructor(context: PieceContext, options: O = {} as O) {
    super(context, options);
  }

  /**
   * Runs when a modal is submitted.
   * The modals custom ID must start with the command's name, followed by a double dash (to prevent naming conflicts).
   * @param interaction The interaction that the modal triggered
   */
  public modalRun?(interaction: ModalSubmitInteraction): Awaitable<unknown>;
}
