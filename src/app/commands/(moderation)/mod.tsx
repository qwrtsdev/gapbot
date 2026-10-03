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
          customId="mod-menu"
        >
          <StringSelectMenuOption
            label="Option 1"
            value="1"
            description="First option"
            emoji="1️⃣"
          />
          <StringSelectMenuOption
            label="Option 2"
            value="2"
            description="Second option"
            emoji="2️⃣"
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
