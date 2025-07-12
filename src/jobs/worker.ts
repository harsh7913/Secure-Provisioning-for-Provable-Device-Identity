import { Worker } from 'bullmq';
import { connection } from '../utils/redis';
import { MockHSM } from '../hsm/MockHSM';
import { logger } from '../utils/logger';
import { saveAuditLog } from '../services/provisioning.service';

const hsm = new MockHSM();

new Worker('provision', async job => {
  const { deviceId, operatorId } = job.data;
  logger.info(`🔧 Starting provisioning for device ${deviceId}`);

  const result = await hsm.provisionDevice(deviceId);

  await saveAuditLog({ deviceId, operatorId, ...result });
  logger.info(`✅ Provisioning complete for ${deviceId}`);
}, { connection });