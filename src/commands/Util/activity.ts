import { ApplyOptions } from '@sapphire/decorators';
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from '@sapphire/framework';
import {
  APIInvite,
  InviteTargetType,
  RESTPostAPIChannelInviteJSONBody,
  RouteBases,
  Routes,
} from 'discord-api-types/v10';
import config from '../../config.js';

@ApplyOptions<Command.Options>({
  description: 'Starts an activity in a voice channel',
  requiredClientPermissions: [
    'EMBED_LINKS',
    'SEND_MESSAGES',
    'CREATE_INSTANT_INVITE',
  ],
})
export class UserCommand extends Command {
  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const res = await fetch(
      `${RouteBases.api}${Routes.channelInvites(
        interaction.options.getChannel('channel', true).id
      )}`,
      {
        method: 'POST',
        headers: {
          authorization: `Bot ${config.discordToken}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          max_age: 0,
          target_type: InviteTargetType.EmbeddedApplication,
          target_application_id: interaction.options.getString(
            'activity',
            true
          ),
        } as RESTPostAPIChannelInviteJSONBody),
      }
    );
    const invite = (await res.json()) as APIInvite;

    if (res.status !== 200)
      return interaction.reply({
        embeds: [
          {
            title: 'An error occurred while creating the invite.',
            color: 'RED',
          },
        ],
      });
    return interaction.reply({
      content: `https://discord.gg/${invite.code}`,
      ephemeral: interaction.options.getBoolean('public', false) ?? false,
    });
  }
  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      (b) =>
        b
          .setName(this.name)
          .setDescription(this.description)
          // guild voice
          .addChannelOption((i) =>
            i
              .setName('channel')
              .setRequired(true)
              .addChannelTypes(2)
              .setDescription('The voice channel to start the activity in.')
          )
          .addStringOption((i) =>
            i
              .setName('activity')
              .setRequired(true)
              .setDescription('The activity to start.')
              .setChoices(
                {
                  name: 'Watch Together',
                  value: '880218394199220334',
                },
                {
                  name: 'Sketch Heads (new Doodle Crew)',
                  value: '902271654783242291',
                },
                {
                  name: 'Word Snacks',
                  value: '879863976006127627',
                },
                {
                  name: 'Putt Party (New! Requires Boost Level 1)',
                  value: '945737671223947305',
                },
                {
                  name: 'Land-io (New! Requires Boost Level 1)',
                  value: '903769130790969345',
                },
                {
                  name: 'Bobble League (New! Requires Boost Level 1)',
                  value: '947957217959759964',
                },
                {
                  name: 'Poker Night (Requires Boost Level 1)',
                  value: '755827207812677713',
                },
                {
                  name: 'Chess In The Park (Requires Boost Level 1)',
                  value: '832012774040141894',
                },
                {
                  name: 'Checkers In The Park (Requires Boost Level 1)',
                  value: '832013003968348200',
                },
                {
                  name: 'Blazing 8s (New!, formerly Ocho) (Requires Boost Level 1)',
                  value: '832025144389533716',
                },
                {
                  name: 'Letter League (formerly Letter Tile) (Requires Boost Level 1)',
                  value: '879863686565621790',
                },
                {
                  name: 'SpellCast (Requires Boost Level 1)',
                  value: '852509694341283871',
                }
              )
          )
          .addBooleanOption((i) =>
            i
              .setName('public')
              .setRequired(false)
              .setDescription(
                'Whether the invite should be public. Defaults to true.'
              )
          ),
      {
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ['981013643946766427'],
      }
    );
  }
}
