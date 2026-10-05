import * as dotenv from 'dotenv';
import { readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
dotenv.config();

// editable from the mod menu, stored only in database/settings.json
interface Settings {
  settings: {
    honeypot_enabled: boolean;
    auto_vc_enabled: boolean;
    auto_vc_name: string; // {#} = room number
    admin_ban_honeypot: boolean;
    routine_enabled: boolean;
    routine_cron: string; // Asia/Bangkok
  };
  channels: {
    honeypot_channel: string;
    honeypot_log_channel: string; // '' = no log
    auto_voice_channel: string;
    routine_channels: string[];
  };
}

interface Config {
  discord_token: string | null;
  guild_id: string;

  categories: {
    ticket_category: string;
  };

  channels: Settings['channels'] & {
    log_channel: string;
  };

  settings: Settings['settings'];

  maintenance_mode: {
    is_enabled: boolean;
    developer_id?: string[];
  };

  external: {
    gemini_api_key?: string | undefined;
    ai_allowed_roles?: string[];
  };
}

// runtime-editable values live outside src/, otherwise `commandkit dev` sees the write,
// restarts the bot and every pending button/modal handler is lost
const SETTINGS_PATH = 'database/settings.json';
const saved: Settings = JSON.parse(readFileSync(SETTINGS_PATH, 'utf8'));

const config: Config = {
  discord_token: process.env.DISCORD_TOKEN || null,
  guild_id: '1459282920538771518',

  categories: {
    ticket_category: '',
  },

  channels: {
    log_channel: '1532079508986003486',
    ...saved.channels,
  },

  settings: saved.settings,

  maintenance_mode: {
    is_enabled: true,
    developer_id: ['824442267318222879'],
  },

  external: {
    gemini_api_key: process.env.GEMINI_API_KEY ?? undefined,
    ai_allowed_roles: ['1492863029317210283', '1473011299091746877', '1492919958840279082', '1492919958840279083', '1492919958840279084']
  }
}

export async function saveConfig() {
  const { honeypot_channel, honeypot_log_channel, auto_voice_channel, routine_channels } = config.channels;
  const data: Settings = {
    settings: config.settings,
    channels: { honeypot_channel, honeypot_log_channel, auto_voice_channel, routine_channels },
  };
  await writeFile(SETTINGS_PATH, JSON.stringify(data, null, 2) + '\n');
}

export default config;