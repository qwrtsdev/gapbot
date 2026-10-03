import { MessageFlags, type StringSelectMenuInteraction } from 'discord.js';

export default async function optionTwo(interaction: StringSelectMenuInteraction) {
  await interaction.reply({ content: 'Option 1', flags: MessageFlags.Ephemeral });
}
