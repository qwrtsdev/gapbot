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

// discord.js emits these instead of throwing; an 'error' with no listener would be rethrown by Node
client.on('error', (error) => {
  Logger.error(`[⚠️ ErrorHandler: client] ${error.stack ?? error.message}`);
});

client.on('shardError', (error, shardId) => {
  Logger.error(`[⚠️ ErrorHandler: shard #${shardId}] ${error.stack ?? error.message}`);
});

export default client;
