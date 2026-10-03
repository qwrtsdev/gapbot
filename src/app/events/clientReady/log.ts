import type { EventHandler } from 'commandkit';
import { Logger } from 'commandkit/logger';

const handler: EventHandler<'clientReady'> = async (client) => {
  Logger.info(`🤖 Logged in as ${client.user.username} (#${client.user.id})`);
};

export default handler;
