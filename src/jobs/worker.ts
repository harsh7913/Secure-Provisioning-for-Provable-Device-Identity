import { Worker } from 'bullmq';
import { connection } from '../utils/redis';
import { MockHSM } from '../hsm/MockHSM';
import { logger } from '../utils/logger';
import { updateJobStatus } from '../services/provisioning.service';

const hsm = new MockHSM();

new Worker(
  'provision',
  async job => {
    const { deviceId, operatorId } = job.data;
    const jobId = Number(job.id);

    logger.info(`🔧 Starting provisioning for device ${deviceId} (job ID: ${jobId})`);

    // mark IN_PROGRESS
    await updateJobStatus(jobId, { status: 'IN_PROGRESS' });

    try {
      const result = await hsm.provisionDevice(deviceId);

      await updateJobStatus(jobId, {
        status: 'COMPLETED',
        cert: result.cert,
        publicKey: result.publicKey,
      });

      logger.info(`✅ Provisioning complete for ${deviceId} (job ID: ${jobId})`);
    } catch (error) {
      await updateJobStatus(jobId, {
        status: 'FAILED',
        error: (error as Error).message,
      });
      logger.error(`❌ Provisioning failed for ${deviceId} (job ID: ${jobId}):`, error);
    }
  },
  { connection }
);
