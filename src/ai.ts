import { Logger } from 'commandkit';
import { configureAI } from '@commandkit/ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { Message } from 'discord.js';
import config from '@/config';

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

  const placeholder_messages_state = new Map<string, Message>();

  configureAI({
    selectAiModel: async () => ({
      model: google.languageModel('gemini-3.1-flash-lite-preview'),
      maxSteps: 5,
      temperature: 0.7,
    }),

    messageFilter: async (commandkit, message) => {
      const is_mentioned = message.mentions.users.has(message.client.user!.id);
      const is_valid = is_mentioned && message.inGuild() && !message.author.bot;

      if (!is_valid) return false;

      if (config.external.ai_allowed_roles) {
        if (!message.member?.roles.cache.some((role) => config.external.ai_allowed_roles?.includes(role.id))) {
          await message
            .reply({
              content: '🔐 ขออภัย ฟีเจอร์นี้ใช้ได้เฉพาะ **ชาวหู (เมมเบอร์ชิพ)** และ **Server Booster** เท่านั้น',
              allowedMentions: { parse: [] }
            })
            .catch(() => null);
          return false;
        }
      }

      return true;
    },

    onProcessingStart: async (ctx, message) => {
      if (!message.channel.isTextBased()) return;

      const thinking_msg = await message
        .reply({
          content: ai_waiting_message[Math.floor(Math.random() * ai_waiting_message.length)],
          allowedMentions: { parse: [] },
        })
        .catch(() => null);

      if (thinking_msg) { placeholder_messages_state.set(message.id, thinking_msg); }
    },

    onResult: async (ctx, message, result) => {
      const thinking_msg = placeholder_messages_state.get(message.id);
      placeholder_messages_state.delete(message.id);

      if (!result.text) return;

      const content = result.text.slice(0, 2000);

      if (thinking_msg) {
        await thinking_msg.edit({ content, allowedMentions: { parse: [] } }).catch(() => null);
      } else {
        await message
          .reply({ content, allowedMentions: { parse: [] } })
          .catch(() => null);
      }
    },

    onError: async (ctx, message, error) => {
      Logger.error(error);

      const thinking_placeholder = placeholder_messages_state.get(message.id);
      placeholder_messages_state.delete(message.id);
      if (thinking_placeholder) { await thinking_placeholder.delete().catch(() => null); }

      await message
        .reply({ stickers: ['1497655160229466164'] })
        .catch(() => null);
    },
  });
}