import type { EventHandler } from 'commandkit';
import optionOne from '@/app/interactions/option_one';
import optionTwo from '@/app/interactions/option_two';

const options = {
  '1': optionOne,
  '2': optionTwo,
};

const handler: EventHandler<'interactionCreate'> = async (interaction) => {
  if (!interaction.isStringSelectMenu() || interaction.customId !== 'mod-menu') return;

  const value = interaction.values[0] as keyof typeof options;
  await options[value]?.(interaction);
};

export default handler;
