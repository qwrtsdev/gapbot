import {
  Container,
  TextDisplay,
  Separator,
  Section,
  Button,
  Modal,
  Label,
  ChannelSelectMenu,
  ShortInput,
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
  config.settings.auto_vc_enabled = !config.settings.auto_vc_enabled;
  await interaction.update({ components: [view()] });
  await saveConfig();
};

const saveChannel: OnModalKitSubmit = async (interaction, context) => {
  const channel = interaction.fields.getSelectedChannels('auto-vc-channel')?.first();
  if (channel) config.channels.auto_voice_channel = channel.id;

  if (interaction.isFromMessage()) await interaction.update({ components: [view()] });
  context.dispose();
  await saveConfig();
};

const openModal: OnButtonKitClick = async (interaction) => {
  const select = <ChannelSelectMenu customId="auto-vc-channel" channelTypes={[ChannelType.GuildVoice]} />;
  if (config.channels.auto_voice_channel) select.setDefaultChannels(config.channels.auto_voice_channel);

  const modal = (
    <Modal title="ตั้งค่าห้องเสียงอัติโนมัติ" onSubmit={saveChannel} options={{ autoReset: false }}>
      <Label label="ห้องเสียงหลัก" description="เมื่อมีคนเข้าห้องนี้ บอทจะสร้างห้องเสียงใหม่ให้">
        {select}
      </Label>
    </Modal>
  );

  await interaction.showModal(modal);
};

const saveName: OnModalKitSubmit = async (interaction, context) => {
  context.dispose();
  config.settings.auto_vc_name = interaction.fields.getTextInputValue('auto-vc-name').trim();

  if (interaction.isFromMessage()) await interaction.update({ components: [view()] });
  await saveConfig();
};

const openNameModal: OnButtonKitClick = async (interaction) => {
  const modal = (
    <Modal title="ตั้งชื่อห้องเสียงที่สร้าง" onSubmit={saveName} options={{ autoReset: false }}>
      <Label label="ชื่อห้อง" description="ใส่ {#} เพื่อแทนลำดับห้อง (ไม่ใส่ก็ได้)">
        <ShortInput customId="auto-vc-name" value={config.settings.auto_vc_name} maxLength={90} required />
      </Label>
    </Modal>
  );

  await interaction.showModal(modal);
};

const spawnChannel: OnButtonKitClick = async (interaction) => {
  if (!interaction.inCachedGuild()) return;
  await interaction.deferUpdate(); // channel create delay 3 second window

  const current = interaction.guild.channels.cache.get(config.channels.auto_voice_channel);
  const channel = await interaction.guild.channels
    .create({ name: '➕ สร้างห้องเสียง', type: ChannelType.GuildVoice, parent: current?.parentId })
    .catch(() => null);

  if (!channel) {
    await interaction.followUp({ content: 'สร้างห้องไม่สำเร็จ บอทอาจไม่มีสิทธิ์ Manage Channels', flags: MessageFlags.Ephemeral });
    return;
  }

  config.channels.auto_voice_channel = channel.id;
  await interaction.editReply({ components: [view()] });
  await saveConfig();
};

function view() {
  const enabled = config.settings.auto_vc_enabled;
  const channel = config.channels.auto_voice_channel;

  return (
    <Container>
      <TextDisplay content="# 🎙️ ตั้งค่าห้องเสียงอัติโนมัติ" />
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
        <TextDisplay content={`**ห้องเสียงหลัก:** ${channel ? `<#${channel}>` : 'ยังไม่ได้ตั้งค่า'}`} />
        <Button style={ButtonStyle.Secondary} onClick={openModal}>
          ตั้งค่า
        </Button>
      </Section>
      <Section>
        <TextDisplay content={`**ชื่อห้องที่สร้าง:** \`${config.settings.auto_vc_name}\`\n-# ตัวอย่าง: ${config.settings.auto_vc_name.replaceAll('{#}', '1')}`} />
        <Button style={ButtonStyle.Secondary} onClick={openNameModal}>
          แก้ไข
        </Button>
      </Section>
      <Section>
        <TextDisplay content="**สร้างห้องเสียงหลักใหม่** แล้วใช้เป็นห้องหลักทันที" />
        <Button style={ButtonStyle.Primary} onClick={spawnChannel}>
          สร้างห้อง
        </Button>
      </Section>
    </Container>
  );
}

export default async function autoVcSettings(interaction: StringSelectMenuInteraction) {
  await interaction.followUp({
    components: [view()],
    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
  });
}
