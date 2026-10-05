import {
  Container,
  TextDisplay,
  Separator,
  Section,
  Button,
  Modal,
  Label,
  ParagraphInput,
  ShortInput,
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
import { nextRoutineRun, readRoutine, routinePayload, scheduleRoutine, validateCron, writeRoutine } from '@/routine';

const toggle: OnButtonKitClick = async (interaction) => {
  config.settings.routine_enabled = !config.settings.routine_enabled;
  await interaction.update({ components: [view()] });
  await saveConfig();
};

const saveMessage: OnModalKitSubmit = async (interaction, context) => {
  context.dispose();
  await writeRoutine(interaction.fields.getTextInputValue('routine-message'));
  if (interaction.isFromMessage()) await interaction.update({ components: [view()] });
};

const openMessageModal: OnButtonKitClick = async (interaction) => {
  const current = await readRoutine();

  const modal = (
    <Modal title="แก้ไขข้อความประจำเวลา" onSubmit={saveMessage} options={{ autoReset: false }}>
      <Label label="ข้อความ" description="รองรับ Markdown สูงสุด 2000 ตัวอักษร">
        <ParagraphInput customId="routine-message" value={current} maxLength={2000} required />
      </Label>
    </Modal>
  );

  await interaction.showModal(modal);
};

const saveCron: OnModalKitSubmit = async (interaction, context) => {
  context.dispose();
  const cron = interaction.fields.getTextInputValue('routine-cron').trim().split(/\s+/).join(' ');

  try {
    validateCron(cron);
  } catch (err) {
    await interaction.reply({ content: `❌ cron ไม่ถูกต้อง: ${(err as Error).message}`, flags: MessageFlags.Ephemeral });
    return;
  }

  config.settings.routine_cron = cron;
  scheduleRoutine(interaction.client);
  if (interaction.isFromMessage()) await interaction.update({ components: [view()] });
  await saveConfig();
};

const openCronModal: OnButtonKitClick = async (interaction) => {
  const modal = (
    <Modal title="ตั้งเวลาส่งข้อความ" onSubmit={saveCron} options={{ autoReset: false }}>
      <Label label="ตั้งค่าเวลาส่งข้อความ" description="ใส่รูปแบบ นาที ชั่วโมง วันที่ เดือน วันในสัปดาห์ (เช่น 0 9,21 * * *)">
        <ShortInput customId="routine-cron" value={config.settings.routine_cron} placeholder="0 9,21 * * *" maxLength={100} required />
      </Label>
    </Modal>
  );

  await interaction.showModal(modal);
};

const saveChannels: OnModalKitSubmit = async (interaction, context) => {
  context.dispose();
  const channels = interaction.fields.getSelectedChannels('routine-channels');
  config.channels.routine_channels = channels ? [...channels.keys()] : [];

  if (interaction.isFromMessage()) await interaction.update({ components: [view()] });
  await saveConfig();
};

const openChannelModal: OnButtonKitClick = async (interaction) => {
  const select = (
    <ChannelSelectMenu
      customId="routine-channels"
      channelTypes={[ChannelType.GuildText, ChannelType.GuildAnnouncement]}
      maxValues={25}
      required
    />
  );
  if (config.channels.routine_channels.length) select.setDefaultChannels(config.channels.routine_channels);

  const modal = (
    <Modal title="ตั้งค่าห้องที่ส่งข้อความ" onSubmit={saveChannels} options={{ autoReset: false }}>
      <Label label="ห้องที่ต้องการส่งข้อความ" description="เลือกได้หลายห้อง">
        {select}
      </Label>
    </Modal>
  );

  await interaction.showModal(modal);
};

const testSend: OnButtonKitClick = async (interaction) => {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const content = await readRoutine();
  if (!content) {
    await interaction.editReply('❌ ยังไม่มีข้อความ');
    return;
  }

  const sent = interaction.channel?.isSendable()
    ? await interaction.channel.send(routinePayload(content)).catch(() => null)
    : null;
  await interaction.editReply(sent ? '✅ ส่งข้อความทดสอบแล้ว' : '❌ ส่งข้อความไม่สำเร็จ');
};

function view() {
  const enabled = config.settings.routine_enabled;
  const next = enabled ? nextRoutineRun() : null;
  const channels = config.channels.routine_channels;

  return (
    <Container>
      <TextDisplay content="# 📆 ตั้งค่าข้อความประจำเวลา" />
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
        <TextDisplay content={`**เวลาส่ง:** \`${config.settings.routine_cron}\`\n-# ${next ? `ครั้งถัดไป <t:${Math.floor(next.getTime() / 1000)}:f>` : ''}`} />
        <Button style={ButtonStyle.Secondary} onClick={openCronModal}>
          แก้ไข
        </Button>
      </Section>
      <Section>
        <TextDisplay content={`**ห้องที่ส่ง:** ${channels.length ? channels.map((id) => `<#${id}>`).join(' ') : 'ยังไม่ได้ตั้งค่า'}`} />
        <Button style={ButtonStyle.Secondary} onClick={openChannelModal}>
          ตั้งค่า
        </Button>
      </Section>
      <Section>
        <TextDisplay content="**ข้อความ:** แก้ไขข้อความที่จะส่ง" />
        <Button style={ButtonStyle.Secondary} onClick={openMessageModal}>
          แก้ไข
        </Button>
      </Section>
      <Section>
        <TextDisplay content="**ทดสอบ:** ส่งข้อความไปยังห้องนี้" />
        <Button style={ButtonStyle.Primary} onClick={testSend}>
          ทดสอบ
        </Button>
      </Section>
    </Container>
  );
}

export default async function routineSettings(interaction: StringSelectMenuInteraction) {
  await interaction.followUp({
    components: [view()],
    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
  });
}
