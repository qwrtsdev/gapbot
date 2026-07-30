import { type MiddlewareContext, stopMiddlewares } from 'commandkit';
import { Logger } from 'commandkit/logger';
import config from '@/config';

export function beforeExecute(ctx: MiddlewareContext) {
  if (!config.developer.is_enabled) { return; }

  if (!config.developer.dev_id.includes(ctx.interaction.user.id)) {
    Logger.warn(`[⚠️ Developer Mode] Unauthorized ${ctx.commandName} command used by ${ctx.interaction.user.tag} (${ctx.interaction.user.id})`);
    stopMiddlewares();
  }
}