import { Client } from 'discord.js';
import { Logger } from 'commandkit/logger';

const client = new Client({
  intents: [
    'Guilds',
    'GuildMembers',
    'GuildMessages',
    'MessageContent',
    'GuildVoiceStates'
  ],
});

client.on('error', (error) => {
  Logger.error(`[⚠️ ErrorHandler: client] ${error.stack ?? error.message}`);
});

client.on('shardError', (error, shardId) => {
  Logger.error(`[⚠️ ErrorHandler: shard #${shardId}] ${error.stack ?? error.message}`);
});

process.on('unhandledRejection', (reason) => {
  Logger.error(`[⚠️ ErrorHandler: unhandledRejection] ${reason instanceof Error ? reason.stack : reason}`);
});

process.on('uncaughtException', (error) => {
  Logger.error(`[⚠️ ErrorHandler: uncaughtException] ${error.stack ?? error.message}`);
});

export default client;
