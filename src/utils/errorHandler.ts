import { Logger } from 'commandkit/logger';

type AsyncFn = (...args: any[]) => unknown | Promise<unknown>;

export function softErrorHandling<T extends AsyncFn>(scope: string, handler: T): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      Logger.error(`[⚠️ ErrorHandler: ${scope}] ${err.stack ?? err.message}`);
      return;
    }
  }) as T;
}

