import { StrategyReturns } from '@sapphire/discord.js-utilities';
import {
  ButtonInteraction,
  CommandInteraction,
  ContextMenuInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageButtonStyleResolvable,
  MessageCollectorOptionsParams,
  MessageEmbedOptions,
} from 'discord.js';
import EventEmitter from 'node:events';

export const disableAllComponents = (message: Message) => {
  if (!message.components && !message.components[0]) return message;

  message.components.forEach((component) => {
    component.components.forEach((v) => {
      v.disabled = true;
    });
  });
  return message.edit({
    components: message.components,
  });
};

export const removeAllComponents = (message: Message) => {
  if (!message.components && !message.components[0]) return message;

  return message.edit({
    components: [],
  });
};
export interface ConfirmationMessageOptions {
  disableComponentsOnDeny?: boolean;
  deleteComponentsOnDeny?: boolean;
  disableComponentsOnConfirm?: boolean;
  deleteComponentsOnConfirm?: boolean;
  confirmButtonLabel?: string;
  denyButtonLabel?: string;
  confirmButtonStyle?: MessageButtonStyleResolvable;
  denyButtonStyle?: MessageButtonStyleResolvable;
  confirmButtonCustomId?: string;
  denyButtonCustomId?: string;
  /**
   * If set, the `confirmButtonCustomId` property must be set.
   */
  customConfirmButton?: MessageButton;
  /**
   * If set, the `denyButtonCustomId` property must be set.
   */
  customDenyButton?: MessageButton;
  collectorOptions?: MessageCollectorOptionsParams<'BUTTON'>;
}

export declare interface ConfirmationMessage {
  on(event: 'confirm' | 'deny', listener: (i: ButtonInteraction) => any): this;
}

export interface IStrategyReturns extends StrategyReturns {
  interaction: any;
}

export class ConfirmationMessage extends EventEmitter {
  constructor(
    private interaction:
      | ButtonInteraction
      | CommandInteraction
      | ContextMenuInteraction,
    private embed: MessageEmbedOptions,
    private options?: ConfirmationMessageOptions
  ) {
    super({ captureRejections: true });
    this.createCollector();
  }

  private async createCollector() {
    const msg = <Message>await this.interaction.reply({
      fetchReply: true,
      embeds: [this.embed],
      components: [
        new MessageActionRow().addComponents(
          this.options?.customConfirmButton ??
            new MessageButton()
              .setCustomId(this.options?.confirmButtonCustomId ?? 'confirm')
              .setLabel(this.options?.confirmButtonLabel ?? 'Yes')
              .setStyle(this.options?.confirmButtonStyle ?? 'SUCCESS'),
          this.options?.customDenyButton ??
            new MessageButton()
              .setCustomId(this.options?.denyButtonCustomId ?? 'deny')
              .setLabel(this.options?.denyButtonLabel ?? 'No')
              .setStyle(this.options?.denyButtonStyle ?? 'DANGER')
        ),
      ],
    });

    const collector = msg.createMessageComponentCollector({
      componentType: 'BUTTON',
      dispose: this.options?.collectorOptions?.dispose,
      time: this.options?.collectorOptions?.time,
      idle: this.options?.collectorOptions?.idle ?? 15 * 1000,
      max: this.options?.collectorOptions?.max,
      filter:
        this.options?.collectorOptions?.filter ??
        ((m) => m.user.id === this.interaction.user.id),
    });
    collector.on('collect', async (i) => {
      console.log('collected', i.customId);
      switch (i.customId) {
        case this.options?.confirmButtonCustomId ?? 'confirm':
          if (this.options?.disableComponentsOnConfirm !== false)
            disableAllComponents(<Message>i.message);
          if (this.options?.deleteComponentsOnConfirm !== false)
            removeAllComponents(<Message>i.message);
          this.emit('confirm', i);
          break;
        case this.options?.denyButtonCustomId ?? 'deny':
          collector.stop();
          if (this.options?.disableComponentsOnDeny !== false)
            disableAllComponents(<Message>i.message);
          if (this.options?.deleteComponentsOnDeny !== false)
            removeAllComponents(<Message>i.message);
          this.emit('deny', i);
          break;
        default:
          break;
      }
    });
    collector.on('dispose', () => {
      disableAllComponents(msg);
    });
  }
}
