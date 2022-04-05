import { ApplyOptions } from '@sapphire/decorators';
import {
  PaginatedMessage,
  PaginatedMessagePage,
} from '@sapphire/discord.js-utilities';
import {
  ApplicationCommandRegistry,
  Command,
  CommandOptions,
  RegisterBehavior,
} from '@sapphire/framework';
import type { AutocompleteInteraction, CommandInteraction } from 'discord.js';
import { getClass, Subjects } from '#lib/utils/firestore.js';
import { Util } from '#lib/utils/Util.js';

@ApplyOptions<CommandOptions>({
  name: 'hw',
  description: 'Shows homework for a grade',
  requiredClientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
})
export class UserCommand extends Command {
  public async chatInputRun(interaction: CommandInteraction) {
    if (
      interaction.options.getString('subject') &&
      interaction.options.getString('subject')?.toLowerCase() !== 'history' &&
      interaction.options.getString('subject')?.toLowerCase() !== 'math' &&
      interaction.options.getString('subject')?.toLowerCase() !== 'science' &&
      interaction.options.getString('subject')?.toLowerCase() !== 'english'
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
              .setAutocomplete(true)
          )
          .addStringOption((i) =>
            i
              .setName('subject')
              .setDescription('The subject of the assignment.')
              .setRequired(false)
              .setAutocomplete(true)
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
  public async autocompleteRun(interaction: AutocompleteInteraction) {
    interaction.respond(
      interaction.options.getFocused(true).name === 'grade'
        ? [
            { name: '9th grade', value: 9 },
            { name: '10th grade', value: 10 },
            { name: '11th grade', value: 11 },
            { name: '12th grade', value: 12 },
          ]
        : [
            { name: 'English', value: 'english' },
            { name: 'Math', value: 'math' },
            { name: 'Science', value: 'science' },
            { name: 'History', value: 'history' },
          ]
    );
  }
}
