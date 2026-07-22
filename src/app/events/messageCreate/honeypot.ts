import type { EventHandler } from 'commandkit';
import { Logger } from 'commandkit/logger';
import config from '@/config';

const handler: EventHandler<'messageCreate'> = async (message) => {
  if (message.author.bot) return;
  if (!config.honeypot_channel) return;
  if (message.channelId !== config.honeypot_channel) return;

  // placeholder
  try {
    Logger.warn(`honeypot success`);
  } catch (err) {
    Logger.error(err as Error);
  }
};

export default handler;