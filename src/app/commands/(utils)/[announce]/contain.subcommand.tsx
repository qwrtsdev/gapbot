import {
  CommandData,
  type ChatInputCommand,
  type OnModalKitSubmit,
  Modal,
  ShortInput,
  ParagraphInput,
  Label,
  Container,
  TextDisplay,
} from 'commandkit';
import { MessageFlags } from 'discord.js';
import { softErrorHandling } from '@/utils/errorHandler';

export const command: CommandData = {
  name: 'announce',
  description: 'ประกาศข้อความสู่ช่อง (แบบกล่องข้อความ)',
};

const handleSubmit: OnModalKitSubmit = softErrorHandling('command:announce/modalSubmit', async (interaction, ctx) => {
  const input_channel_id: string | null = interaction.fields.getTextInputValue('channelId').trim() || null;
  const input_reply_id: string | null = interaction.fields.getTextInputValue('replyId').trim() || null;
  const input_message: string = interaction.fields.getTextInputValue('message');

  const channel = input_channel_id
    ? await interaction.client.channels.fetch(input_channel_id).catch(() => null)
    : interaction.channel;

  if (!channel?.isTextBased() || !('send' in channel)) {
    await interaction.reply({
      content: '❌ ห้องที่ระบุไม่ใช่ห้องข้อความ',
      flags: MessageFlags.Ephemeral,
    });

    ctx.dispose();
    return;
  }

  const container = (
    <Container>
      <TextDisplay content={input_message} />
    </Container>
  )

  const message_payload: any = {
    components: [container],
    reply: input_reply_id ? { messageReference: input_reply_id } : undefined,
    flags: MessageFlags.IsComponentsV2,
  };

  try {
    await channel.send(message_payload);
  } catch (err) {
    await interaction.reply({
      content: '❌ ส่งข้อความไม่สำเร็จ',
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
          placeholder="กรอกข้อความที่ต้องการส่ง (สามารถใช้ Markdown ได้)"
          required
        />
      </Label>
    </Modal>
  );

  await interaction.showModal(modal);
});