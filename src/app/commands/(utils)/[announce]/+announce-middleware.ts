import type { MiddlewareContext } from 'commandkit';
import config from '@/config';

export function afterExecute(ctx: MiddlewareContext) {
  console.log(`Command execution completed for user ${ctx.interaction.user.id}`);
}