import { ActivityType } from 'discord.js';
import type { EventHandler } from 'commandkit';

const handler: EventHandler<'clientReady'> = async (client) => {
  client.user?.setPresence({
    status: 'idle',
    activities: [{
      name: 'custom',
      type: ActivityType.Custom,
      state: 'https://tip.gap.bo',
    }],
  });
};

export default handler;