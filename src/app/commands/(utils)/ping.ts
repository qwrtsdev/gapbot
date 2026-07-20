import type { ChatInputCommand, CommandData } from 'commandkit';

export const command: CommandData = {
  name: 'ping',
  description: "เช็คสถานะความหน่วงของบอท",
};

export const chatInput: ChatInputCommand = async (ctx) => {
  const latency = (ctx.client.ws.ping ?? -1).toString();
  const response = `Latency: ${latency}ms`;

  await ctx.interaction.reply(response);
};
