import '#lib/setup.js';
import config from './config.js';
import { LogLevel, SapphireClient } from '@sapphire/framework';

const client = new SapphireClient({
  caseInsensitiveCommands: true,
  logger: {
    level: LogLevel.Info,
  },
  // @ts-ignore
  hmr: {
    enabled: true,
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
    'GUILD_EMOJIS_AND_STICKERS',
    'DIRECT_MESSAGES',
    'DIRECT_MESSAGE_REACTIONS',
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
