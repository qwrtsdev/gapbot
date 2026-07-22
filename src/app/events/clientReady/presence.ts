import { ActivityType } from 'discord.js';
import type { EventHandler } from 'commandkit';
import { softErrorHandling } from '@/utils/softError';

const handler: EventHandler<'clientReady'> = softErrorHandling('event:clientReady/presence', async (client) => {
  client.user?.setPresence({
    status: 'idle',
    activities: [{
      name: 'custom',
      type: ActivityType.Custom,
      state: 'tip.gap.bo',
    }],
  });
});

export default handler;