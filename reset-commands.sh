#!/usr/bin/env bash

echo "=========== Resetting Guild Commands ==========="

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

TOKEN="${DISCORD_TOKEN:-${BOT_TOKEN:-${TOKEN:-}}}"
if [[ -z "$TOKEN" && -f ".env" ]]; then
  ENV_TOKEN="$(
    grep -E '^[[:space:]]*DISCORD_TOKEN[[:space:]]*=' .env \
      | tail -n1 \
      | sed -E "s/^[[:space:]]*DISCORD_TOKEN[[:space:]]*=[[:space:]]*//; s/^['\"]//; s/['\"][[:space:]]*$//"
  )"
  TOKEN="${ENV_TOKEN:-}"
fi

if [[ -z "$TOKEN" ]]; then
  echo "Missing bot token. Set DISCORD_TOKEN (or BOT_TOKEN/TOKEN) or add DISCORD_TOKEN in .env."
  exit 1
fi

GUILD_ID="${1:-}"
if [[ -z "$GUILD_ID" ]]; then
  GUILD_ID="$(grep -oP "guild_id:\s*['\"]\K[^'\"]+" src/config.ts | head -n1 || true)"
fi

if [[ -z "$GUILD_ID" ]]; then
  echo "Missing guild id. Pass it as: ./reset-commands.sh <guild_id>"
  exit 1
fi

echo "Resetting guild commands for guild: $GUILD_ID"
DISCORD_TOKEN="$TOKEN" GUILD_ID="$GUILD_ID" node <<'NODE'
const { Client } = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const guildId = process.env.GUILD_ID;

(async () => {
  const client = new Client({ intents: [] });
  await client.login(token);

  if (!client.application) {
    throw new Error('Client application is unavailable after login.');
  }

  await client.application.commands.set([], guildId);
  console.log(`Cleared all guild commands for ${guildId}.`);
  await client.destroy();
})().catch((err) => {
  console.error(err?.message ?? String(err));
  process.exit(1);
});
NODE

echo "=========== Resetting Complete ==========="
