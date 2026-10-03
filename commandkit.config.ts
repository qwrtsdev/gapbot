import { defineConfig } from 'commandkit/config';
import { ai } from '@commandkit/ai';

export default defineConfig({
  showUnknownPrefixCommandsWarning: false,
  antiCrashScript: { development: false, production: false },
  plugins: [ai()],
});
