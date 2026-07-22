import type { ChatInputCommand, CommandData } from 'commandkit';
import { softErrorHandling } from '@/utils/softError';

export const command: CommandData = {
  name: 'modmenu',
  description: "เปิดเมนูการจัดการสำหรับผู้ดูแล",
};

export const chatInput: ChatInputCommand = softErrorHandling('command:modmenu/chatInput', async (ctx) => {
  await ctx.interaction.reply('Mod menu is not implemented yet.');
});
