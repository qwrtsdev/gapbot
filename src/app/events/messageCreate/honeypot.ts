import type { EventHandler } from 'commandkit';
import config from '@/config';
import { softErrorHandling } from '@/utils/errorHandler';

const handler: EventHandler<'messageCreate'> = softErrorHandling('event:messageCreate/honeypot', async (message) => {
  if (message.author.bot) return;
  if (message.channelId !== config.honeypot_channel) return;

  message.deletable && await message.delete();

  if (config.settings.admin_ban_honeypot === false) { if (message.member?.permissions.has('Administrator')) return; }

  const target = message.member;
  await target?.ban({ reason: 'honeypot' });
});

export default handler;