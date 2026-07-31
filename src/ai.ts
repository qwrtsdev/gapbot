import { Logger } from 'commandkit';
import { configureAI } from '@commandkit/ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import config from '@/config';
import type { Message } from 'discord.js';

const ai_waiting_message = [
  '🧠 กูว่าแล้วมึงต้องอ่าน..',
  '🧠 กำลังคิดอยู่...',
  '🧠 ขอคิดแปปน้า..',
  '🧠 ใจเย็นๆ กำลังคิด..',
  '🧠 ถามเยอะชิบหาย..',
  '🧠 ใช้หมองแปป..',
  '🧠 กำลังคำนวนกฎทางควอนตัมฟิสิกส์..',
  '🧠 ผมขอตอบว่า..'
];

if (!config.external.gemini_api_key) {
  // if Gemini API key is not set, AI features will be disabled
  // please set the `GEMINI_API_KEY` as environment variable to enable AI features.
  // you can obtain a Gemini API key from https://developers.google.com/ai/generative-ai
  // or use any other AI provider that is supported by `@commandkit/ai`.
  Logger.warn('Gemini API key is not set. AI features will be disabled.');
} else {
  const google = createGoogleGenerativeAI({ apiKey: config.external.gemini_api_key });

  const placeholder_messages = new Map<string, Message>();

  configureAI({
    selectAiModel: async () => ({
      model: google.languageModel('gemini-3.1-flash-lite-preview'),
      maxSteps: 5,
      temperature: 0.7,
    }),

    messageFilter: async (commandkit, message) => {
      return (
        message.mentions.users.has(message.client.user!.id) &&
        message.inGuild() &&
        // message.member?.permissions.has('Administrator') &&
        !message.author.bot
      );
    },

    onProcessingStart: async (ctx, message) => {
      if (!message.channel.isTextBased()) return;

      const thinkingMsg = await message
        .reply({
          content: ai_waiting_message[Math.floor(Math.random() * ai_waiting_message.length)],
          allowedMentions: { parse: [] },
        })
        .catch(() => null);

      if (thinkingMsg) {
        placeholder_messages.set(message.id, thinkingMsg);
      }
    },

    onResult: async (ctx, message, result) => {
      const thinkingMsg = placeholder_messages.get(message.id);
      placeholder_messages.delete(message.id);

      if (!result.text) return;

      const content = result.text.slice(0, 1500);

      if (thinkingMsg) {
        await thinkingMsg.edit({ content, allowedMentions: { parse: [] } }).catch(() => null);
      } else {
        await message
          .reply({ content, allowedMentions: { parse: [] } })
          .catch(() => null);
      }
    },

    onError: async (ctx, message, error) => {
      Logger.error(error);

      const thinking_placeholder = placeholder_messages.get(message.id);
      placeholder_messages.delete(message.id);
      if (thinking_placeholder) { await thinking_placeholder.delete().catch(() => null); }

      await message
        .reply({ stickers: ['1497655160229466164'] })
        .catch(() => null);
    },
  });
}