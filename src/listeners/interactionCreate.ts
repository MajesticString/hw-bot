import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { Awaitable, Interaction, ModalSubmitInteraction } from 'discord.js';

@ApplyOptions<Listener.Options>({
  event: Events.InteractionCreate,
})
export class InteractionCreateListener extends Listener<
  typeof Events.InteractionCreate
> {
  public override run(interaction: Interaction) {
    if (interaction.isModalSubmit()) {
      this.handleModalSubmits(interaction);
    }
  }

  private handleModalSubmits(interaction: ModalSubmitInteraction) {
    if (
      typeof this.container.stores
        .get('commands')
        .get(interaction.customId.split('--')[0])?.modalRun === 'function'
    )
      // @ts-ignore
      this.container.stores
        .get('commands')
        .get(interaction.customId.split('--')[0])
        .modalRun(interaction);
  }
}

declare module '@sapphire/framework' {
  interface Command {
    modalRun?(interaction: ModalSubmitInteraction): Awaitable<unknown>;
  }
}
