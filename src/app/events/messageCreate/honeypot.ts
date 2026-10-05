import type { EventHandler } from 'commandkit';
import type { Message } from 'discord.js';
import config from '@/config';

const handler: EventHandler<'messageCreate'> = async (message) => {
  if (!config.settings.honeypot_enabled) return;
  if (!message.inGuild() || message.channelId !== config.channels.honeypot_channel) return;
  if (message.author.bot || !message.member) return;
  if (message.author.id === message.guild.ownerId) return;
  if (!config.settings.admin_ban_honeypot && message.member.permissions.has('Administrator')) return;

  await message.delete().catch(() => null);

  const banned = await message.member
    .ban({ reason: 'honeypot', deleteMessageSeconds: 60 * 60 })
    .then(() => true)
    .catch(() => false);

  await sendLog(message, banned);
  if (!banned) return;

  const log_message = await message.channel
    .send({ content: `🍯 **${message.author.tag}** สแปมเยอะเกิน ถูกแบนเลยง่ะ` })
    .catch(() => null);

  setTimeout(() => { log_message?.delete().catch(() => null); }, 1000 * 60 * 3);
};

async function sendLog(message: Message<true>, banned: boolean) {
  if (!config.channels.honeypot_log_channel) return;
  const channel = await message.client.channels.fetch(config.channels.honeypot_log_channel).catch(() => null);
  if (!channel?.isSendable()) return;

  const content = message.content || (message.attachments.size ? `(ไฟล์แนบ ${message.attachments.size} ไฟล์)` : '(ไม่มีข้อความ)');

  await channel
    .send({
      embeds: [{
        title: banned ? '🍯 แบนจากห้องดักบอท' : '⚠️ แบนจากห้องดักบอทไม่สำเร็จ',
        description: banned ? undefined : 'บอทอาจมียศต่ำกว่าผู้ใช้ หรือไม่มีสิทธิ์ Ban Members',
        color: banned ? 0xed4245 : 0xfee75c,
        thumbnail: { url: message.author.displayAvatarURL() },
        fields: [
          { name: 'ผู้ใช้', value: `${message.author} \`${message.author.tag}\`\n-# ${message.author.id}` },
          { name: 'ห้อง', value: `${message.channel}`, inline: true },
          { name: 'ข้อความ', value: content.slice(0, 1024) },
        ],
        timestamp: new Date().toISOString(),
      }],
    })
    .catch(() => null);
}

export default handler;
