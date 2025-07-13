import { Queue } from 'bullmq';
import { connection } from '../utils/redis';

export const provisionQueue = new Queue('provision', { connection });

provisionQueue.on('error', (err) => {
  console.error('❌ Redis queue error:', err);
});