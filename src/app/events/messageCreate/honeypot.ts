import type { EventHandler } from 'commandkit';
import { Logger } from 'commandkit/logger';
import config from '@/config';
import { softErrorHandling } from '@/utils/softError';

const handler: EventHandler<'messageCreate'> = softErrorHandling('event:messageCreate/honeypot', async (message) => {
  if (message.author.bot) return;
  if (!config.honeypot_channel) return;
  if (message.channelId !== config.honeypot_channel) return;

  if (message.member?.permissions.has('Administrator')) return;

  const member = message.member;
  if (!member) {
    Logger.warn('Could not ban honeypot user because guild member data is unavailable.');
    return;
  }

  await member.ban({ reason: 'honeypot' });
  Logger.info(`User ${message.author.id} banned via honeypot.`);
});

export default handler;