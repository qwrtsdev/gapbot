import type { EventHandler } from 'commandkit';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
} from 'discord.js';
import config from '@/config';
import { softErrorHandling } from '@/utils/errorHandler';

const handler: EventHandler<'voiceStateUpdate'> = softErrorHandling('event:VoiceStateUpdate/auto-vc', async (oldState, newState) => {
  const member = newState.member ?? oldState.member;
  if (!member || member.user.bot) return;

  const core_channel_ids = config.channels.auto_voice_channel;
  const voice_channel = newState.channel;
  const guild = newState.guild;
  const SET_VOICE_CHANNEL_STATUS = 281474976710656n; // discord.js 14 'set voice status'

  if (!voice_channel || !core_channel_ids.includes(voice_channel.id)) return;
  if (oldState.channelId === voice_channel.id) return;

  const parent = voice_channel.parent ?? null;

  const existingRooms = parent
    ? parent.children.cache.filter((ch) =>
      ch.name.startsWith('🔊 ห้องเสียงลำดับที่ #'),
    ).size
    : guild.channels.cache.filter((ch) =>
      ch.name.startsWith('🔊 ห้องเสียงลำดับที่ #'),
    ).size;

  const roomNumber = existingRooms + 1;

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
      deny: ['Connect', 'ReadMessageHistory'] as const,
    },
  ];

  const room = await guild.channels.create({
    name: `🔊 ห้องเสียงลำดับที่ #${roomNumber}`,
    type: ChannelType.GuildVoice,
    parent: parent ?? undefined,
    permissionOverwrites: permissions_payload,
  });

  await member.voice.setChannel(room).catch(() => null);

  const lockEmbed = new EmbedBuilder()
    .setDescription('🔒 ห้องกำลังล็อค')
    .setColor('Yellow');

  const unlockButton = new ButtonBuilder()
    .setCustomId(`unlock_room:${room.id}:${member.id}`)
    .setLabel('ปลดล็อคห้อง')
    .setStyle(ButtonStyle.Success);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(unlockButton);

  const lockMessage = await room
    .send({ embeds: [lockEmbed], components: [row] })
    .catch(() => null);

  if (!lockMessage) return;

  const collector = lockMessage.createMessageComponentCollector({
    time: 10 * 60 * 1000, // 10 min window to unlock, adjust as needed
  });

  collector.on('collect', async (interaction) => {
    const [action, roomId, ownerId] = interaction.customId.split(':');

    if (action !== 'unlock_room' || roomId !== room.id) return;

    if (interaction.user.id !== ownerId) {
      await interaction
        .reply({ content: 'เฉพาะเจ้าของห้องเท่านั้น', ephemeral: true })
        .catch(() => null);
      return;
    }

    await room.permissionOverwrites
      .edit(guild.roles.everyone, { Connect: true })
      .catch(() => null);

    await interaction.deferUpdate().catch(() => null);
    await lockMessage.delete().catch(() => null);
    collector.stop();
  });
},
);

export default handler;