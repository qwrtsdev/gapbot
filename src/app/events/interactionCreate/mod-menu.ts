import type { EventHandler } from 'commandkit';
import auto_vc from '@/app/interactions/auto-vc-settings';
import honeypot from '@/app/interactions/honeypot-settings';
import routine_message from '@/app/interactions/routine-settings';
import ticket from '@/app/interactions/ticket-settings';

const options = {
  'auto-vc-settings': auto_vc,
  'honey-pot-settings': honeypot,
  'routine-message-settings': routine_message,
  'ticket-settings': ticket,
};

const handler: EventHandler<'interactionCreate'> = async (interaction) => {
  if (!interaction.isStringSelectMenu() || interaction.customId !== 'mod-menu-options') return;

  const value = interaction.values[0] as keyof typeof options;

  // re-render the menu
  await interaction.update({ components: interaction.message.components });
  await options[value]?.(interaction);
};

export default handler;
