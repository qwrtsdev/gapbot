import type { MiddlewareContext } from 'commandkit';
import { Logger } from 'commandkit/logger';
import config from '@/config';

export async function afterExecute(ctx: MiddlewareContext) {
  const { interaction } = ctx;
  const actor = interaction.user ? `<@${interaction.user.id}> (${interaction.user.id})` : 'Unknown user';
  const sourceChannelId = interaction.channelId;

  const logChannel = await interaction.client.channels.fetch(config.log_channel)
    .catch((err) => { return null; });

  if (!logChannel?.isTextBased() || !('send' in logChannel)) { return; }

  await logChannel
    .send(`📣 Announce command used by ${actor}\nSource channel: <#${sourceChannelId}> (${sourceChannelId})`,)
    .catch((err) => { return; });
}