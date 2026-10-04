import { MessageFlags, type StringSelectMenuInteraction } from 'discord.js';

export default async function honeypotSettings(interaction: StringSelectMenuInteraction) {
  await interaction.reply({ content: 'ตั้งค่าห้องดักบอท', flags: MessageFlags.Ephemeral });
}
