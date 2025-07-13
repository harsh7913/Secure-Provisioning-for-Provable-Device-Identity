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
    // Step 1: Create DB job record with QUEUED status
    const jobEntry = await createJobRecord(deviceId, operatorId);

    // Step 2: Provision device using HSM
    const hsm = new MockHSM(); // or use new ProductionHSM()
    const { cert, publicKey, privateKey } = await hsm.provisionDevice(deviceId);

    // Step 3: Update job record with cert and public key
    await updateJobStatus(jobEntry.id, {
      status: 'COMPLETED',
      cert,
      publicKey,
    });

    // Step 4: Return full material to client (one-time delivery of private key)
    res.status(201).json({
      message: 'Provisioning successful',
      deviceId,
      cert,
      publicKey,
      privateKey, // Not stored — returned only once
    });
  } catch (error) {
    console.error('❌ Provisioning error:', error);
    res.status(500).json({ error: 'Provisioning failed' });
  }
});

export default router;
