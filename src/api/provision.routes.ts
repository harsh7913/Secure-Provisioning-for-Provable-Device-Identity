import { Router, Request, Response } from 'express';
import { checkRole } from '../utils/auth';
import { createJobRecord } from '../services/provisioning.service';
import { provisionQueue } from '../jobs/queue';

const router = Router();

router.post('/', checkRole('operator'), async (req: Request, res: Response) => {
  const { deviceId, operatorId } = req.body;

  if (!deviceId || !operatorId) {
    return res.status(400).json({ error: 'Missing deviceId or operatorId' });
  }

  try {
    // Create job in DB
    const jobEntry = await createJobRecord(deviceId, operatorId);

    // Enqueue job in BullMQ
    await provisionQueue.add(
      'provision-device',
      { deviceId, operatorId },
      {
        jobId: jobEntry.id.toString(),
        attempts: 3,
        backoff: { type: 'exponential', delay: 3000 },
      }
    );

    res.status(202).json({
      message: 'Provisioning request accepted',
      jobId: jobEntry.id,
    });
  } catch (error) {
    console.error('❌ Failed to enqueue provisioning job:', error);
    res.status(500).json({ error: 'Provisioning enqueue failed' });
  }
});

export default router;
