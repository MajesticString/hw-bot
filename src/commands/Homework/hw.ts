import { getClass, Subjects } from '#lib/utils/firestore.js';
import { Util } from '#lib/utils/Util.js';
import { ApplyOptions } from '@sapphire/decorators';
import {
  PaginatedMessage,
  PaginatedMessagePage,
} from '@sapphire/discord.js-utilities';
import {
  ApplicationCommandRegistry,
  CommandOptions,
  RegisterBehavior,
} from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { HwCommand } from '../../lib/HwCommand.js';

@ApplyOptions<CommandOptions>({
  name: 'hw',
  description: 'Shows homework for a grade',
  requiredClientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
})
export class UserCommand extends HwCommand {
  public async chatInputRun(interaction: CommandInteraction) {
    if (
      interaction.options.getString('subject') &&
      ['history', 'math', 'science', 'english'].includes(
        // true because we checked for it in 2 lines prior
        interaction.options.getString('subject', true).toLowerCase()
      )
    ) {
      return interaction.reply(
        'Invalid subject. Please use one of the following: history, math, science, english'
      );
    }
    if (interaction.options.getString('subject')) {
      const className = await getClass(
        interaction.options.getInteger('grade', true),
        <Subjects>interaction.options.getString('subject', false)
      );

      const assignments: { name: string; value: string; inline?: boolean }[] =
        [];

      className.forEach((res) => {
        const data = res.data();
        if (parseInt(res.id) > Date.now())
          assignments.push(
            {
              name: 'Assignment',
              value: data.name,
              inline: true,
            },
            {
              name: 'Due Date',
              value: new Date(parseInt(res.id)).toLocaleDateString(),
              inline: true,
            },
            {
              name: 'Subject',
              value: data.subject,
              inline: true,
            },
            { name: 'Grade', value: data.grade, inline: true },
            {
              name: 'Description',
              value: data.description,
            }
          );
      });
      const pages: PaginatedMessagePage[] = [];
      pages.push({
        embeds: [
          {
            title: `Homework for ${Util.normalizeGrade(
              interaction.options.getInteger('grade', true),
              'number'
            )}th grade ${interaction.options
              .getString('subject')
              ?.toLowerCase()}`,
            description: '',
          },
        ],
      });
      const pager = new PaginatedMessage({ pages });
      interaction.reply({
        embeds: [
          {
            title: `Homework for ${interaction.options.getInteger(
              'grade',
              true
            )}th ${interaction.options.getString('subject', true)}`,
            fields: !assignments[0]
              ? [
                  {
                    name: 'No homework for this class',
                    value: ':)',
                    inline: false,
                  },
                ]
              : assignments,
          },
        ],
      });
    } else {
    }
  }
  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addIntegerOption((i) =>
            i
              .setName('grade')
              .setDescription('The grades assignments to get.')
              .setRequired(true)
              .addChoices([
                ['9th grade', 9],
                ['10th grade', 10],
                ['11th grade', 11],
                ['12th grade', 12],
              ])
          )
          .addStringOption((i) =>
            i
              .setName('subject')
              .setDescription('The subject of the assignment.')
              .setRequired(false)
              .addChoices([
                ['English', 'english'],
                ['Math', 'math'],
                ['Science', 'science'],
                ['History', 'history'],
              ])
          )
          .addStringOption((i) =>
            i
              .setName('due-date')
              .setDescription('The due date of the assignment.')
              .setRequired(false)
              .setAutocomplete(false)
          )
          .addStringOption((i) =>
            i
              .setName('assigned-date')
              .setDescription('The assigned date of the assignment.')
              .setRequired(false)
              .setAutocomplete(false)
          ),
      {
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ['956773036101599236', '956774184510439494'],
      }
    );
  }
}
