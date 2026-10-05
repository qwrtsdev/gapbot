import {
  Container,
  TextDisplay,
  Separator,
  Section,
  Button,
  Modal,
  Label,
  ChannelSelectMenu,
  type OnButtonKitClick,
  type OnModalKitSubmit,
} from 'commandkit';
import {
  ButtonStyle,
  ChannelType,
  SeparatorSpacingSize,
  MessageFlags,
  type StringSelectMenuInteraction,
} from 'discord.js';
import config, { saveConfig } from '@/config';

const toggle: OnButtonKitClick = async (interaction) => {
  config.settings.honeypot_enabled = !config.settings.honeypot_enabled;
  await interaction.update({ components: [view()] });
  await saveConfig();
};

const toggleAdminBan: OnButtonKitClick = async (interaction) => {
  config.settings.admin_ban_honeypot = !config.settings.admin_ban_honeypot;
  await interaction.update({ components: [view()] });
  await saveConfig();
};

const saveChannel: OnModalKitSubmit = async (interaction, context) => {
  const channel = interaction.fields.getSelectedChannels('honeypot-channel')?.first();
  if (channel) config.channels.honeypot_channel = channel.id;

  if (interaction.isFromMessage()) await interaction.update({ components: [view()] });
  context.dispose();
  await saveConfig();
};

const saveLogChannel: OnModalKitSubmit = async (interaction, context) => {
  context.dispose();

  config.channels.honeypot_log_channel = interaction.fields.getSelectedChannels('honeypot-log-channel')?.first()?.id ?? '';

  if (interaction.isFromMessage()) await interaction.update({ components: [view()] });
  await saveConfig();
};

const openLogModal: OnButtonKitClick = async (interaction) => {
  const select = <ChannelSelectMenu customId="honeypot-log-channel" channelTypes={[ChannelType.GuildText]} />;
  if (config.channels.honeypot_log_channel) select.setDefaultChannels(config.channels.honeypot_log_channel);

  const modal = (
    <Modal title="ตั้งค่าห้องแจ้งเตือนการแบน" onSubmit={saveLogChannel} options={{ autoReset: false }}>
      <Label label="ห้องแจ้งเตือนการแบน" description="(หากไม่ได้เลือกไม่เลือกไว้จะเป็นการปิด)">
        {select}
      </Label>
    </Modal>
  );

  await interaction.showModal(modal);
};

const openModal: OnButtonKitClick = async (interaction) => {
  const select = <ChannelSelectMenu customId="honeypot-channel" channelTypes={[ChannelType.GuildText]} />;
  if (config.channels.honeypot_channel) select.setDefaultChannels(config.channels.honeypot_channel);

  const modal = (
    <Modal title="ตั้งค่าห้องดักบอท" onSubmit={saveChannel} options={{ autoReset: false }}>
      <Label label="ห้องที่ต้องการดักบอท" description="ข้อความทุกข้อความในห้องนี้จะทำให้ผู้ส่งถูกแบน">
        {select}
      </Label>
    </Modal>
  );

  await interaction.showModal(modal);
};

function view() {
  const enabled = config.settings.honeypot_enabled;
  const channel = config.channels.honeypot_channel;
  const admin_ban = config.settings.admin_ban_honeypot;
  const log_channel = config.channels.honeypot_log_channel;

  return (
    <Container>
      <TextDisplay content="# 🍯 ตั้งค่าห้องดักบอท" />
      <Separator spacing={SeparatorSpacingSize.Large} />
      <Section>
        <TextDisplay content={`**สถานะ:** ${enabled ? '🟢 เปิดใช้งาน' : '🔴 ปิดใช้งาน'}`} />
        <Button
          style={enabled ? ButtonStyle.Danger : ButtonStyle.Success}
          onClick={toggle}
        >
          {enabled ? 'ปิด' : 'เปิด'}
        </Button>
      </Section>
      <Section>
        <TextDisplay content={`**ห้องที่ดักบอท:** ${channel ? `<#${channel}>` : 'ยังไม่ได้ตั้งค่า'}`} />
        <Button style={ButtonStyle.Secondary} onClick={openModal}>
          ตั้งค่า
        </Button>
      </Section>
      <Section>
        <TextDisplay content={`**แจ้งเตือนการแบน:** ${log_channel ? `<#${log_channel}>` : 'ไม่มี'}`} />
        <Button style={ButtonStyle.Secondary} onClick={openLogModal}>
          ตั้งค่า
        </Button>
      </Section>
      <Section>
        <TextDisplay content={`**แบนแอดมินด้วย:** ${admin_ban ? '🟢 เปิด' : '🔴 ปิด'}\n-# ใช้กรณีแอดมินโดนแฮคไปแล้ว`} />
        <Button
          style={admin_ban ? ButtonStyle.Danger : ButtonStyle.Success}
          onClick={toggleAdminBan}
        >
          {admin_ban ? 'ปิด' : 'เปิด'}
        </Button>
      </Section>
    </Container>
  );
}

export default async function honeypotSettings(interaction: StringSelectMenuInteraction) {
  await interaction.followUp({
    components: [view()],
    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
  });
}
