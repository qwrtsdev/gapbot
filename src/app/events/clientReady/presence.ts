import { ActivityType } from 'discord.js';
import type { EventHandler } from 'commandkit';

const handler: EventHandler<'clientReady'> = async (client) => {
  client.user?.setPresence({
    status: 'idle',
    activities: [{
      name: 'custom',
      type: ActivityType.Custom,
      state: 'tip.gap.bo',
    }],
  })

  // const states = ['กำลังเต้นอย่ามือบอน ..', 'กำลังคิดถึงชี่ ..', 'กำลังแหล่ ..']

  // let currentStatus = 0;

  // setInterval(() => {
  //   currentStatus = (currentStatus + 1) % states.length;

  //   client.user?.setPresence({
  //     activities: [
  //       {
  //         type: ActivityType.Custom,
  //         name: "custom",
  //         state: states[currentStatus],
  //       },
  //     ],
  //   });
  // }, 15000);
};

export default handler;