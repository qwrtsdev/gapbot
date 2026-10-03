import { MessageFlags, type StringSelectMenuInteraction } from 'discord.js';

export default async function optionTwo(interaction: StringSelectMenuInteraction) {
  await interaction.reply({ content: 'Option 2', flags: MessageFlags.Ephemeral });
}
