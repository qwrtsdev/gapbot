import { type MiddlewareContext, stopMiddlewares } from 'commandkit';
import { MessageFlags } from 'discord.js';
import config from '@/config';

export function beforeExecute(ctx: MiddlewareContext) {
  if (config.maintenance_mode.is_enabled === true) {
    if (config.maintenance_mode.developer_id.includes(ctx.interaction.user.id)) { return; }

    ctx.interaction.isRepliable() && ctx.interaction.reply({
      content: 'ขณะนี้บอทอยู่ใน **🛠️ Maintenance Mode** จึงไม่สามารถใช้งานคำสั่งได้ชั่วคราว',
      flags: MessageFlags.Ephemeral
    }).catch(() => null);

    stopMiddlewares();
  }
}