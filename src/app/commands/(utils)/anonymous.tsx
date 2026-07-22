import {
  type ChatInputCommand,
  type OnModalKitSubmit,
  type CommandData,
  Modal,
  ShortInput,
  ParagraphInput,
} from 'commandkit';
import { MessageFlags } from 'discord.js';

export const command: CommandData = {
  name: 'anonymous',
  description: "ส่งข้อความแบบไม่ระบุตัวตน",
};

const handleSubmit: OnModalKitSubmit = async (interaction, ctx) => {
  const channelId = interaction.fields.getTextInputValue('channelId');
  const message = interaction.fields.getTextInputValue('message');

  const channel = await interaction.client.channels.fetch(channelId);
  if (channel && 'send' in channel) { await channel.send({ content: message }); }

  await interaction.reply({
    content: '✅ ส่งข้อความเรียบร้อยแล้ว',
    flags: MessageFlags.Ephemeral,
  });

  ctx.dispose();
};

export const chatInput: ChatInputCommand = async ({ interaction }) => {
  const modal = (
    <Modal title="ข้อความไม่ระบุตัวตน" onSubmit={handleSubmit}>
      <ShortInput
        customId="channelId"
        label="Channel ID"
        placeholder="กรอกไอดีห้องที่ต้องการส่งข้อความ"
        required
      />
      <ParagraphInput
        customId="message"
        label="Message"
        placeholder="กรอกข้อความที่ต้องการส่ง"
        required
      />
    </Modal>
  );

  await interaction.showModal(modal);
};