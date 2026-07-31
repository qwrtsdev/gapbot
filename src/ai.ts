import { Logger } from 'commandkit';
import { configureAI } from '@commandkit/ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import config from '@/config';

if (!config.external.gemini_api_key) {
  // if Gemini API key is not set, AI features will be disabled
  // please set the `GEMINI_API_KEY` as environment variable to enable AI features.
  // you can obtain a Gemini API key from https://developers.google.com/ai/generative-ai
  // or use any other AI provider that is supported by `@commandkit/ai`.
  Logger.warn('Gemini API key is not set. AI features will be disabled.');
} else {
  const google = createGoogleGenerativeAI({ apiKey: config.external.gemini_api_key });

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
      message.channel.isTextBased()
        ? await message.channel?.sendTyping()
        : null;
    },

    onResult: async (ctx, message, result) => {
      if (result.text) {
        await message
          .reply({
            content: result.text.slice(0, 1500),
            allowedMentions: { parse: [] },
          })
          .catch(() => null);
      }
    },

    onError: async (ctx, message, error) => {
      Logger.error(error)
      await message
        .reply({ stickers: ['1497655160229466164'] })
        .catch((err) => null);
    },
  });
}