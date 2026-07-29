import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  guild_id: process.env.GUILD_ID || null,
  honeypot_channel: process.env.HONNEYPOT_CHANNEL_ID || null,

  settings: {
    admin_ban_honeypot: false,
  }
}

export default config;