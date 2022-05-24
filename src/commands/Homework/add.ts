import { ApplyOptions } from '@sapphire/decorators';
import {
  ApplicationCommandRegistry,
  Command,
  CommandOptions,
  RegisterBehavior,
} from '@sapphire/framework';
import {
  MessageActionRow,
  Modal,
  ModalActionRowComponent,
  ModalSubmitInteraction,
  TextInputComponent,
} from 'discord.js';
import { HwCommand } from '../../lib/HwCommand.js';

@ApplyOptions<CommandOptions>({
  name: 'add',
  description: 'Adds an assignment to the homework list',
  requiredClientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
})
export class UserCommand extends HwCommand {
  public override async chatInputRun(
    interaction: Command.ChatInputInteraction
  ) {
    interaction.showModal(
      new Modal()
        .setTitle('Add Assignment')
        .setCustomId('add--modal')
        .addComponents(
          new MessageActionRow<ModalActionRowComponent>().addComponents(
            new TextInputComponent()
              .setLabel('Assignment Name')
              .setCustomId('assignment-name')
              .setStyle('SHORT')
              .setRequired(true)
          ),
          new MessageActionRow<ModalActionRowComponent>().addComponents(
            new TextInputComponent()
              .setLabel('Grade')
              .setCustomId('grade')
              .setStyle('SHORT')
              .setRequired(true)
          ),
          new MessageActionRow<ModalActionRowComponent>().addComponents(
            new TextInputComponent()
              .setLabel('Subject')
              .setCustomId('subject')
              .setStyle('SHORT')
              .setRequired(true)
          ),
          new MessageActionRow<ModalActionRowComponent>().addComponents(
            new TextInputComponent()
              .setLabel('Due Date')
              .setCustomId('due-date')
              .setStyle('SHORT')
              .setRequired(true)
              .setPlaceholder('dd/mm/yyyy')
              .setMinLength(4)
          ),
          new MessageActionRow<ModalActionRowComponent>().addComponents(
            new TextInputComponent()
              .setLabel('Description')
              .setCustomId('description')
              .setStyle('PARAGRAPH')
              .setRequired(false)
              .setPlaceholder(
                'Maybe some assignment instructions or location of the assignment.'
              )
          )
        )
    );
  }

  public static modalRun(interaction: ModalSubmitInteraction) {
    console.log('asdfafdsadfs');
  }

  public override async registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      (builder) => builder.setName(this.name).setDescription(this.description),

      {
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        registerCommandIfMissing: true,
      }
    );
  }
}
