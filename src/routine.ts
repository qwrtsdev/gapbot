import { Cron } from 'croner';
import { readFile, writeFile } from 'node:fs/promises';
import type { Client } from 'discord.js';
import config from '@/config';

// cron settings
const ROUTINE_PATH = 'database/routine.txt';
const TIMEZONE = 'Asia/Bangkok';

let job: Cron | null = null;

export async function readRoutine() {
  return (await readFile(ROUTINE_PATH, 'utf8').catch(() => '')).trim();
}

export function routinePayload(content: string) {
  return { embeds: [{ description: content, color: 0xff99c6 }] };
}

export async function writeRoutine(content: string) {
  await writeFile(ROUTINE_PATH, content);
}

// throws an error on an invalid pattern
export function validateCron(pattern: string) {
  new Cron(pattern, { timezone: TIMEZONE, paused: true }).stop();
}

export function nextRoutineRun() {
  return job?.nextRun() ?? null;
}

export function scheduleRoutine(client: Client) {
  job?.stop();
  job = new Cron(config.settings.routine_cron, { timezone: TIMEZONE, protect: true }, async () => {
    if (!config.settings.routine_enabled) return;

    const content = await readRoutine();
    if (!content) return;

    for (const id of config.channels.routine_channels) {
      const channel = await client.channels.fetch(id).catch(() => null);
      if (channel?.isSendable()) await channel.send(routinePayload(content)).catch(() => null);
    }
  });
}
