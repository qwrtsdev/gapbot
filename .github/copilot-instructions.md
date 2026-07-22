# Copilot instructions for `gapbot`

## Build, run, test, and lint

This repository is a TypeScript CommandKit Discord bot scaffolded by `create-commandkit`.

| Task | Command | Notes |
| --- | --- | --- |
| Run in development | `npm run dev` | Starts `commandkit dev` |
| Build | `npm run build` | Runs `commandkit build` |
| Start built app | `npm run start` | Runs `commandkit start` |

There are currently no repository scripts for linting or automated tests, and no single-test command is configured.

## High-level architecture

- Runtime entry is `src/app.ts`, which creates the Discord client with intents for guilds, members, messages, and message content.
- CommandKit loads behavior from file-based modules under `src/app/commands` and `src/app/events`.
- `clientReady` handlers in `src/app/events/clientReady/` are split by responsibility:
  - `log.ts`: startup logging
  - `presence.ts`: bot presence setup
  - `refreshCommands.ts`: recursive command metadata discovery and guild command registration
- `refreshCommands.ts` scans `src/app/commands` recursively, imports each command module dynamically, extracts `command.name`/`command.description`, and bulk-overwrites guild slash commands for `config.guild_id`.
- `messageCreate/honeypot.ts` is a channel-specific moderation hook keyed by `config.honeypot_channel`.
- `src/config.ts` is the central runtime config module for guild/channel IDs.

## Key conventions in this codebase

- **Command module shape**: command files export `command` metadata plus a typed handler (for example `chatInput` in slash commands).
- **Event module shape**: event files export a typed `EventHandler<'eventName'>` as default.
- **Grouping pattern**: command folders use parenthesized groups like `(utils)` and `(moderation)` for organization.
- **Path aliases**: internal imports use `@/` (configured in `tsconfig.json`).
- **Guild command sync strategy**: slash command registration is done on `clientReady` via `client.application.commands.set(...)` against a single guild ID from config.
- **Logging**: use `Logger` from `commandkit/logger` for operational logs in event handlers.

