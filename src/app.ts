import { Client } from 'discord.js';
import { Logger } from 'commandkit/logger';

const client = new Client({
  intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent'],
});

if (process.listenerCount('unhandledRejection') === 0) {
  process.on('unhandledRejection', (reason) => {
    const err = reason instanceof Error ? reason : new Error(String(reason));
    Logger.error(`[⚠️ ErrorHandler: unhandledRejection] ${err.stack ?? err.message}`);
  });
}

if (process.listenerCount('uncaughtException') === 0) {
  process.on('uncaughtException', (error) => {
    Logger.error(`[⚠️ ErrorHandler: uncaughtException] ${error.stack ?? error.message}`);
  });
}

export default client;
