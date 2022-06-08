import '#lib/setup.js';
import { LogLevel, SapphireClient } from '@sapphire/framework';
import config from './config.js';

process.on('uncaughtException', console.error);

const client = new SapphireClient({
  caseInsensitiveCommands: true,
  logger: {
    level: LogLevel.Info,
  },
  allowedMentions: {
    repliedUser: true,
    parse: ['users'],
  },
  // @ts-ignore
  hmr: {
    enabled: true,
  },
  modalCommands: {
    separator: '--',
  },
  loadMessageCommandListeners: true,
  failIfNotExists: false,
  presence: {
    activities: [
      {
        name: 'for homework',
        type: 'WATCHING',
      },
    ],
  },
  shards: 'auto',
  intents: [
    'GUILDS',
    'GUILD_MEMBERS',
    'GUILD_EMOJIS_AND_STICKERS',
    'DIRECT_MESSAGES',
    'DIRECT_MESSAGE_REACTIONS',
    'GUILD_MESSAGES',
  ],
});

const main = async () => {
  try {
    client.logger.info('Logging in');
    await client.login(config.discordToken);
    client.logger.info('logged in');
  } catch (error) {
    client.logger.fatal(error);
    client.destroy();
  }
};

main();
