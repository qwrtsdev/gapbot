import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  guild_id: '1459282920538771518',

  channels: {
    log_channel: '1532079508986003486',
    honeypot_channel: '1529376207311863898',
    auto_voice_channel: ['1532027977007628459'],
  },

  settings: {
    admin_ban_honeypot: false,
  },

  developer: {
    is_enabled: true,
    dev_id: ['123'],
  }
}

export default config;