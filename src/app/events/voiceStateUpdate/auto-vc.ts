import type { EventHandler } from 'commandkit';
import { ChannelType } from 'discord.js';
import config from '@/config';
import { softErrorHandling } from '@/utils/errorHandler';

const handler: EventHandler<'voiceStateUpdate'> = softErrorHandling('event:VoiceStateUpdate/auto-vc', async (oldState, newState) => {
  // const member = newState.member ?? oldState.member;
  // if (!member || member.user.bot) return;

  // const voice_channel = newState.channel;
  // const voice_channel_category = voice_channel?.parentId ?? null;
  // const guild = newState.guild;
  // const SET_VOICE_CHANNEL_STATUS = 281474976710656n; // discord.js 14 'set voice status' bit

  // const voice_channel_permissions = [
  //   {
  //     id: member.id,
  //     allow: ['Connect', 'MuteMembers', 'DeafenMembers', SET_VOICE_CHANNEL_STATUS]
  //   },
  //   {
  //     id: guild.roles.everyone,
  //     allow: [],
  //     deny: ['Connect'],
  //   }
  // ]

  // const room_config = {
  //   name: `🔊 ${member.user.username}`,
  //   type: ChannelType.GuildVoice,
  //   parent: voice_channel_category ?? null,
  //   permissionOverwrites: [...voice_channel_permissions]
  // }

  // await guild.channels.create(room_config);
  console.log('VoiceStateUpdate event triggered');
  return;
});

export default handler;