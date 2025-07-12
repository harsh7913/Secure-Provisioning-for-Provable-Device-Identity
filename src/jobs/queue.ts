import { Queue } from 'bullmq';
import { connection } from '../utils/redis';

export const provisionQueue = new Queue('provision', { connection });