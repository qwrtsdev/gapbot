import type { EventHandler } from 'commandkit';
import { scheduleRoutine } from '@/routine';

const handler: EventHandler<'clientReady'> = async (client) => { scheduleRoutine(client); };

export default handler;
