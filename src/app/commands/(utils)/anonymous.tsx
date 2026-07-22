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
  name: 'anonymous',
  description: "ส่งข้อความแบบไม่ระบุตัวตน",
};

export const metadata: CommandMetadata = {
  userPermissions: 'Administrator',
};

const handleSubmit: OnModalKitSubmit = softErrorHandling('command:anonymous/modalSubmit', async (interaction, ctx) => {
  const channelId = interaction.fields.getTextInputValue('channelId');
  const replyId = interaction.fields.getTextInputValue('replyId');
  const message = interaction.fields.getTextInputValue('message');
  const channel = await interaction.client.channels.fetch(channelId);

  if (channel && 'send' in channel) {
    await channel.send({
      content: message,
      reply: replyId ? { messageReference: replyId } : undefined,
    });
  }

  await interaction.reply({
    content: '✅ ส่งข้อความเรียบร้อยแล้ว',
    flags: MessageFlags.Ephemeral,
  });

  ctx.dispose();
});

export const chatInput: ChatInputCommand = softErrorHandling('command:anonymous/chatInput', async ({ interaction }) => {
  const modal = (
    <Modal title="ข้อความไม่ระบุตัวตน" onSubmit={handleSubmit}>
      <Label label="ไอดีห้อง">
        <ShortInput
          customId="channelId"
          placeholder="กรอกไอดีห้องที่ต้องการส่งข้อความ"
          required
        />
      </Label>
      <Label label="ตอบกลับข้อความ (ถ้าไม่มีให้เว้น)">
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