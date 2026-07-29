import {
  type ChatInputCommand,
  type OnModalKitSubmit,
  type CommandData,
  type CommandMetadata,
  Modal,
  ShortInput,
  ParagraphInput,
  Label,
} from 'commandkit';
import { MessageFlags } from 'discord.js';
import { softErrorHandling } from '@/utils/softError';

export const command: CommandData = {
  name: 'announce',
  description: 'ประกาศข้อความสู่ช่องที่กำหนด',
};

export const metadata: CommandMetadata = {
  userPermissions: 'Administrator',
};

const handleSubmit: OnModalKitSubmit = softErrorHandling('command:announce/modalSubmit', async (interaction, ctx) => {
  const channelId = interaction.fields.getTextInputValue('channelId').trim();
  const replyId = interaction.fields.getTextInputValue('replyId');
  const message = interaction.fields.getTextInputValue('message');
  const channel = channelId ? await interaction.client.channels.fetch(channelId).catch(() => null) : null;

  const payload = {
    content: message,
    reply: replyId ? { messageReference: replyId } : undefined,
  };

  if (channelId && !channel) {
    await interaction.reply({
      content: '❌ ไม่พบห้องจากไอดีที่ระบุ',
      flags: MessageFlags.Ephemeral,
    });
    ctx.dispose();
    return;
  }

  if (channel && channel.isTextBased() && 'send' in channel) {
    await channel.send(payload);
  } else if (interaction.channel && 'send' in interaction.channel && interaction.channel.isTextBased()) {
    await interaction.channel.send(payload);
  } else {
    await interaction.reply({
      content: '❌ ไม่สามารถส่งข้อความไปยังห้องนี้ได้',
      flags: MessageFlags.Ephemeral,
    });
    ctx.dispose();
    return;
  }

  await interaction.reply({
    content: '✅ ส่งข้อความเรียบร้อยแล้ว',
    flags: MessageFlags.Ephemeral,
  });

  ctx.dispose();
});

export const chatInput: ChatInputCommand = softErrorHandling('command:announce/chatInput', async ({ interaction }) => {
  const modal = (
    <Modal title="ประกาศข้อความ" onSubmit={handleSubmit}>
      <Label label="ไอดีห้อง (ถ้ามี)">
        <ShortInput
          customId="channelId"
          placeholder="กรอกไอดีห้องที่ต้องการส่งข้อความ"
        />
      </Label>
      <Label label="ไอดีข้อความ (ถ้ามี)">
        <ShortInput
          customId="replyId"
          placeholder="กรอกไอดีข้อความที่ต้องการตอบกลับ"
        />
      </Label>
      <Label label="ข้อความ">
        <ParagraphInput
          customId="message"
          placeholder="กรอกข้อความที่ต้องการส่ง"
          required
        />
      </Label>
    </Modal>
  );

  await interaction.showModal(modal);
});