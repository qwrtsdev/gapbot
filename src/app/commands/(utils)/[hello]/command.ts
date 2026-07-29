import type { ChatInputCommand, CommandData } from 'commandkit';

export const command: CommandData = {
  name: 'hello',
  description: 'hello test',
};

export const chatInput: ChatInputCommand = async (ctx) => {
  await ctx.interaction.reply('hello loaded');
};
