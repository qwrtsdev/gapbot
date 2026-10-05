import type { EventHandler } from 'commandkit';
import { ChannelType } from 'discord.js';
import config from '@/config';

// uses REGEX to make room's name templates
function roomPattern(template: string) {
  const escaped = template.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped.replaceAll('\\{#\\}', '(\\d+)')}$`);
}

const handler: EventHandler<'voiceStateUpdate'> = async (oldState, newState) => {
  // delete a room after the last person leaves
  const left = oldState.channel;
  if (
    left && left.id !== newState.channelId && left.id !== config.channels.auto_voice_channel
    && left.members.size === 0 && roomPattern(config.settings.auto_vc_name).test(left.name)
  ) {
    await left.delete().catch(() => null);
  }

  const member = newState.member ?? oldState.member;
  if (!member || member.user.bot) return;

  if (!config.settings.auto_vc_enabled) return;

  const voice_channel = newState.channel;
  const guild = newState.guild;
  const SET_VOICE_CHANNEL_STATUS = 281474976710656n; // 'set voice status' bit

  if (!voice_channel || voice_channel.id !== config.channels.auto_voice_channel) return;
  if (oldState.channelId === voice_channel.id) return;

  const parent = voice_channel.parent ?? null;

  const template = config.settings.auto_vc_name;
  const pattern = roomPattern(template);
  const used = new Set(guild.channels.cache.map((ch) => Number(ch.name.match(pattern)?.[1])));
  let room_number = 1;
  while (used.has(room_number)) room_number++;

  const permissions_payload = [
    {
      id: member.id,
      allow: [
        'Connect',
        'MuteMembers',
        'DeafenMembers',
        SET_VOICE_CHANNEL_STATUS,
      ] as const,
    },
    {
      id: guild.roles.everyone,
      deny: ['ReadMessageHistory'] as const,
    },
  ];

  const room = await guild.channels
    .create({
      name: template.replaceAll('{#}', String(room_number)),
      type: ChannelType.GuildVoice,
      parent: parent ?? undefined,
      permissionOverwrites: permissions_payload,
    })
    .catch(() => null);
  if (!room) return;

  await member.voice.setChannel(room).catch(() => room.delete().catch(() => null));
};

export default handler;
