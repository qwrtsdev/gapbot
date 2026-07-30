import * as dotenv from 'dotenv';
dotenv.config();

interface Config {
  guild_id: string;

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
    developer_id: string[];
  };
}

const config: Config = {
  guild_id: '1459282920538771518',

  channels: {
    log_channel: '1532079508986003486',
    honeypot_channel: '1529376207311863898',
    auto_voice_channel: ['1532027977007628459'],
  },

  settings: {
    admin_ban_honeypot: false,
  },

  maintenance_mode: {
    is_enabled: false,
    developer_id: ['824442267318222879'],
  }
}

export default config;