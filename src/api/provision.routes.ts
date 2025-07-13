import { Router, Request, Response } from 'express';
import { checkRole } from '../utils/auth';
import { createJobRecord, updateJobStatus } from '../services/provisioning.service';
import { MockHSM } from '../hsm/MockHSM';

const router = Router();

router.post('/', checkRole('operator'), async (req: Request, res: Response) => {
  const { deviceId, operatorId } = req.body;

  if (!deviceId || !operatorId) {
    return res.status(400).json({ error: 'Missing deviceId or operatorId' });
  }

  try {
    const jobEntry = await createJobRecord(deviceId, operatorId);
    const hsm = new MockHSM();
    const { cert, publicKey } = await hsm.provisionDevice(deviceId);

    await updateJobStatus(jobEntry.id, {
      status: 'COMPLETED',
      cert,
      publicKey,
    });

    res.status(201).json({
      message: 'Provisioning successful',
      deviceId,
      cert,
      publicKey,
      // ✅ No privateKey returned
    });
  } catch (error) {
    console.error('❌ Provisioning error:', error);
    res.status(500).json({ error: 'Provisioning failed' });
  }
});

export default router;
