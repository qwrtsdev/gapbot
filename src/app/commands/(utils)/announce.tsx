import {
  type ChatInputCommand,
  type CommandData,
  type CommandMetadata,
  type OnModalKitSubmit,
  Modal,
  ShortInput,
  ParagraphInput,
  Label,
  Container,
  TextDisplay,
} from 'commandkit';
import { ApplicationCommandOptionType, MessageFlags } from 'discord.js';

export const command: CommandData = {
  name: 'announce',
  description: 'ประกาศข้อความสู่ช่องที่กำหนด',
  options: [
    {
      name: 'style',
      description: 'รูปแบบข้อความ',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: 'แบบข้อความธรรมดา', value: 'plain' },
        { name: 'แบบกล่องข้อความ', value: 'contain' },
      ],
    },
  ],
};

export const metadata: CommandMetadata = {
  userPermissions: 'Administrator',
};

const handleSubmit = (style: string): OnModalKitSubmit => async (interaction, ctx) => {
  ctx.dispose();
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const input_channel_id: string | null = interaction.fields.getTextInputValue('channelId').trim() || null;
  const input_reply_id: string | null = interaction.fields.getTextInputValue('replyId').trim() || null;
  const input_message: string = interaction.fields.getTextInputValue('message');

  const channel = input_channel_id
    ? await interaction.client.channels.fetch(input_channel_id).catch(() => null)
    : interaction.channel;

  if (!channel?.isTextBased() || !('send' in channel)) {
    await interaction.editReply('❌ ห้องที่ระบุไม่ใช่ห้องข้อความ');
    return;
  }

  const reply = input_reply_id ? { messageReference: input_reply_id } : undefined;

  const message_payload: any = style === 'contain'
    ? {
      components: [
        <Container>
          <TextDisplay content={input_message} />
        </Container>,
      ],
      reply,
      flags: MessageFlags.IsComponentsV2,
    }
    : { content: input_message, reply };

  try {
    await channel.send(message_payload);
  } catch {
    await interaction.editReply('❌ ส่งข้อความไม่สำเร็จ');
    return;
  }

  await interaction.editReply('✅ ส่งข้อความเรียบร้อยแล้ว');
};

export const chatInput: ChatInputCommand = async ({ interaction }) => {
  const style = interaction.options.getString('style', true);

  const modal = (
    <Modal title="ประกาศข้อความ" onSubmit={handleSubmit(style)} options={{ autoReset: false }}>
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
};
