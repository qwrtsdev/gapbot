import { MessageFlags, type StringSelectMenuInteraction } from 'discord.js';

export default async function autoVcSettings(interaction: StringSelectMenuInteraction) {
  await interaction.reply({ content: 'ตั้งค่าห้องเสียงอัติโนมัติ', flags: MessageFlags.Ephemeral });
}
