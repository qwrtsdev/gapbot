import type { EventHandler } from 'commandkit';
import { Logger } from 'commandkit/logger';
import { softErrorHandling } from '@/utils/softError';

const handler: EventHandler<'clientReady'> = softErrorHandling('event:clientReady/log', async (client) => {
  Logger.info(`🤖 Logged in as ${client.user.username} (#${client.user.id})`);
});

export default handler;
