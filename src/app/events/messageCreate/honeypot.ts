import { Collection, type EventHandler } from 'commandkit';
import config from '@/config';
import { softErrorHandling } from '@/utils/errorHandler';

const handler: EventHandler<'messageCreate'> = softErrorHandling('event:messageCreate/honeypot', async (message) => {
  if (message.channelId !== config.channels.honeypot_channel) return;
  if (message.author.bot) return;

  const target = message.member;
  if (config.settings.admin_ban_honeypot === false) { if (target?.permissions.has('Administrator')) return; }

  message.deletable && await message.delete();
  await target
    ?.ban({ reason: 'honeypot' })
    .catch(() => null);

  const honeypot_channel = message.guild?.channels.cache.get(config.channels.honeypot_channel);
  const log_message = honeypot_channel?.isTextBased()
    ? await honeypot_channel.send({ content: `🍯 **${target?.user.tag}** สแปมเยอะเกิน ถูกแบนเลยง่ะ` })
    : null;

  setInterval(() => { log_message?.delete().catch(() => null); }, 1000 * 60 * 3);

  const other_channels = message.guild?.channels.cache.filter((c) =>
    c.isTextBased() && c.id !== message.channelId && c.permissionsFor(message.guild!.members.me!)?.has(['ViewChannel', 'ReadMessageHistory', 'ManageMessages']),
  ) ?? new Collection();

  await Promise.allSettled(
    other_channels.map(async (channel) => {
      if (!channel.isTextBased()) return;
      const recent = await channel.messages.fetch({ limit: 5 }).catch(() => null);
      const latest = recent?.find((m) => m.author.id === target?.id);
      latest?.deletable && await latest.delete().catch(() => null);
    }),
  );
});

export default handler;