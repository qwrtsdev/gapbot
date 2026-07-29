// This is the root file of `/announce` command. It contains the metadata only.

import type { ChatInputCommand, CommandData, CommandMetadata } from 'commandkit';
import { softErrorHandling } from '@/utils/softError';

export const command: CommandData = {
  name: 'announce',
  description: 'ประกาศข้อความสู่ช่องที่กำหนด',
};


// Temporary test handler to verify the command is discovered by CommandKit.
export const chatInput: ChatInputCommand = softErrorHandling('command:announce/chatInput', async (ctx) => {
  await ctx.interaction.reply('announce root (test)');
});