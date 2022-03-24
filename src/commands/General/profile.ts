import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, ContextMenuInteraction } from 'discord.js';
import { getUser } from '#utils/firestore.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { TEST_SERVER_ID } from '#lib/constants.js';

@ApplyOptions<CommandOptions>({
	name: 'profile',
	description: 'Shows general info about a user',
	chatInputCommand: {
		register: true
	}
})
export class UserCommand extends Command {
	public async chatInputRun(interaction: CommandInteraction) {
		this.respond(interaction);
	}

	public async contextMenuRun(interaction: ContextMenuInteraction) {
		this.respond(interaction);
	}

	private async respond(interaction: CommandInteraction | ContextMenuInteraction) {
		const userArg = interaction.options.getUser('user', false) ?? interaction.user;
		const user = await getUser(userArg.id);

		interaction.reply({
			embeds: [
				{
					title: userArg.tag,
					fields: [
						{
							name: 'Reputation',
							value: user?.reputation.toString()
						}
					]
				}
			]
		});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			new SlashCommandBuilder()
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((i) => i.setName('user').setDescription('The user to get. Defaults to you.').setRequired(false)),
			{
				guildIds: [TEST_SERVER_ID]
			}
		);

		registry.registerContextMenuCommand({
			name: this.name,
			type: 'USER'
		});
	}
}
