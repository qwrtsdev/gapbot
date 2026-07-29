import type { ChatInputCommand, CommandData, CommandMetadata } from 'commandkit';
import { softErrorHandling } from '@/utils/errorHandler';

export const command: CommandData = {
  name: 'modmenu',
  description: "เปิดเมนูการจัดการสำหรับผู้ดูแล",
};

export const metadata: CommandMetadata = {
  userPermissions: 'Administrator',
}

export const chatInput: ChatInputCommand = softErrorHandling('command:modmenu/chatInput', async (ctx) => {
  await ctx.interaction.reply('Mod menu is not implemented yet.');
});
