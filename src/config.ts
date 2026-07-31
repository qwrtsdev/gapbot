import * as dotenv from 'dotenv';
dotenv.config();

interface Config {
  discord_token: string | null;
  guild_id: string;

  categories: {
    ticket_category: string;
  };

  channels: {
    log_channel: string;
    honeypot_channel: string;
    auto_voice_channel: string[];
  };

  settings: {
    admin_ban_honeypot: boolean;
  };

  maintenance_mode: {
    is_enabled: boolean;
    developer_id?: string[];
  };

  external: {
    gemini_api_key?: string | undefined;
    ai_allowed_roles?: string[];
  };
}

const config: Config = {
  discord_token: process.env.DISCORD_TOKEN || null,
  guild_id: '1459282920538771518',

  categories: {
    ticket_category: '',
  },

  channels: {
    log_channel: '1532079508986003486',
    honeypot_channel: '1529376207311863898',
    auto_voice_channel: ['1532027977007628459'],
  },

  settings: {
    admin_ban_honeypot: false,
  },

  maintenance_mode: {
    is_enabled: true,
    developer_id: ['824442267318222879'],
  },

  external : {
    gemini_api_key: process.env.GEMINI_API_KEY ?? undefined,
    ai_allowed_roles: ['1492863029317210283', '1473011299091746877', '1492919958840279082', '1492919958840279083', '1492919958840279084']
  }
}

export default config;