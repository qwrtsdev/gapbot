import { MessageFlags, type StringSelectMenuInteraction } from 'discord.js';

export default async function routineSettings(interaction: StringSelectMenuInteraction) {
  await interaction.reply({ content: 'ตั้งค่าข้อความประจำเวลา', flags: MessageFlags.Ephemeral });
}
