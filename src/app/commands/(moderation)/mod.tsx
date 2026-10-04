import {
  type ChatInputCommand,
  type CommandData,
  type CommandMetadata,
  Container,
  TextDisplay,
  Separator,
  ActionRow,
  StringSelectMenu,
  StringSelectMenuOption,
} from 'commandkit';
import {
  SeparatorSpacingSize,
  MessageFlags
} from 'discord.js';

export const command: CommandData = {
  name: 'mod',
  description: "เปิดเมนูการจัดการระบบ",
};

export const metadata: CommandMetadata = {
  userPermissions: 'Administrator',
}

export const chatInput: ChatInputCommand = async ({ interaction }) => {
  const menu = (
    <Container>
      <TextDisplay content="# 🔧 เมนูการจัดการระบบ" />
      <Separator spacing={SeparatorSpacingSize.Large} />
      <TextDisplay content="-# กรุณาเลือกตัวเลือกที่ต้องการ" />
      <ActionRow>
        <StringSelectMenu
          placeholder="เลือกตัวเลือกที่ต้องการ"
          customId="mod-menu-options"
        >
          <StringSelectMenuOption
            label="ตั้งค่าห้องเสียงอัติโนมัติ"
            value="auto-vc-settings"
            description="เปิด/ปิด หรือตั้งค่าเพิ่มเติม"
            emoji="🎙️"
          />
          <StringSelectMenuOption
            label="ตั้งค่าห้องดักบอท"
            value="honey-pot-settings"
            description="เปิด/ปิด หรือตั้งค่าเพิ่มเติม"
            emoji="🍯"
          />
          <StringSelectMenuOption
            label="ตั้งค่าข้อความประจำเวลา"
            value="routine-message-settings"
            description="เปิด/ปิด หรือตั้งค่าเพิ่มเติม"
            emoji="📆"
          />
          <StringSelectMenuOption
            label="ตั้งค่าระบบทิคเก็ต"
            value="ticket-settings"
            description="เปิด/ปิด หรือตั้งค่าเพิ่มเติม"
            emoji="🎟️"
          />
        </StringSelectMenu>
      </ActionRow>
    </Container>
  );

  await interaction.reply({
    components: [menu],
    flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
  });
};
