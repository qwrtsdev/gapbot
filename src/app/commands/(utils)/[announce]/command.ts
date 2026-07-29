// This is the root file of `/announce` command. It contains the metadata only.

import type { CommandData, CommandMetadata } from 'commandkit';

export const command: CommandData = {
  name: 'announce',
  description: 'ประกาศข้อความสู่ช่องที่กำหนด',
};

export const metadata: CommandMetadata = {
  userPermissions: 'Administrator',
}