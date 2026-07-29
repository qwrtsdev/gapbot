import type { MiddlewareContext } from 'commandkit';
import config from '@/config';

export function afterExecute(ctx: MiddlewareContext) {
  console.log('message sent.');
}