import { MessageFlags, type StringSelectMenuInteraction } from 'discord.js';

export default async function ticketSettings(interaction: StringSelectMenuInteraction) {
  await interaction.reply({ content: 'ตั้งค่าระบบทิคเก็ต', flags: MessageFlags.Ephemeral });
}
