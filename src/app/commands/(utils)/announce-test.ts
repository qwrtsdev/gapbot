import type { ChatInputCommand, CommandData } from 'commandkit';
import { softErrorHandling } from '@/utils/softError';

export const command: CommandData = {
  name: 'announce-test',
  description: 'Temporary test command to verify discovery',
};

export const chatInput: ChatInputCommand = softErrorHandling('command:announce-test/chatInput', async (ctx) => {
  await ctx.interaction.reply('announce-test loaded');
});
