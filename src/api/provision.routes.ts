import { Router } from 'express';
import { provisionQueue } from '../jobs/queue';
import { checkRole } from '../utils/auth';

const router = Router();

router.post('/', checkRole('operator'), async (req, res) => {
  const { deviceId, operatorId } = req.body;
  if (!deviceId || !operatorId) {
    return res.status(400).json({ error: 'Missing deviceId or operatorId' });
  }

  const job = await provisionQueue.add('provision-device', { deviceId, operatorId });
  res.status(202).json({ message: 'Provisioning enqueued', jobId: job.id });
});

export default router;