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
    const jobEntry = await createJobRecord(deviceId, operatorId);

    // ✅ Enqueue job instead of direct HSM call
    await provisionQueue.add(
      'provision',
      {
        jobId: jobEntry.id,
        deviceId,
        operatorId,
      },
      { jobId: jobEntry.id.toString() }
    );

    return res.status(202).json({
      message: 'Provisioning queued',
      jobId: jobEntry.id,
      status: 'QUEUED',
    });
  } catch (error) {
    console.error('❌ Provisioning error:', error);
    return res.status(500).json({ error: 'Provisioning failed' });
  }
});

export default router;
