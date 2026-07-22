import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';
import type { EventHandler } from 'commandkit';
import { Logger } from 'commandkit/logger';
import config from '@/config';

const GUILD_ID = config.guild_id;

async function collectCommandData(dir: string) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const commands: Array<{ name: string; description?: string }> = [];

  for (const ent of entries) {
    const full = path.join(dir, ent.name);

    if (ent.isDirectory()) {
      const nested = await collectCommandData(full);
      commands.push(...nested);
      continue;
    }

    if (!/\.(js|ts|jsx|tsx)$/.test(ent.name)) continue;

    try {
      const imported = await import(pathToFileURL(full).href);

      const cmd = imported.command ?? imported.default?.command ?? imported.default;
      if (cmd && typeof cmd.name === 'string') {
        commands.push({ name: cmd.name, description: cmd.description ?? '' });
      }
    } catch (err) {
      // ignore files that fail to import
      Logger.warn(`Skipping command file ${full}: ${(err as Error).message}`);
    }
  }

  return commands;
}

const handler: EventHandler<'clientReady'> = async (client) => {
  try {
    if (!client.application) {
      Logger.warn('Client application not available; cannot refresh guild commands yet.');
      return;
    }

    const commandsDir = path.join(process.cwd(), 'src', 'app', 'commands');
    const commands = await collectCommandData(commandsDir);

    if (commands.length === 0) {
      Logger.info('No command metadata found to register for guild.');
      return;
    }

    // Bulk overwrite guild commands
    await client.application.commands.set(commands as any, GUILD_ID);

    Logger.info(`Refreshed ${commands.length} slash command(s) in guild ${GUILD_ID}`);
  } catch (err) {
    Logger.error(err as Error);
  }
};

export default handler;
