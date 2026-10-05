import {
  Container,
  TextDisplay,
  Separator,
  ActionRow,
  StringSelectMenu,
  StringSelectMenuOption,
} from 'commandkit';
import {
  SeparatorSpacingSize,
  MessageFlags,
  type StringSelectMenuInteraction,
} from 'discord.js';

export default async function ticketSettings(interaction: StringSelectMenuInteraction) {
  const menu = (
    <Container>
      <TextDisplay content="ขณะนี้ยังไม่มีเมนู กรุณารออัพเดท" />
    </Container>
  );

  await interaction.followUp({
    components: [menu],
    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
  });
}
