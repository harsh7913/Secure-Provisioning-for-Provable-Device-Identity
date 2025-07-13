import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '../utils/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/status/:deviceId', verifyJWT, async (req, res) => {
  const { deviceId } = req.params;

  try {
    const latestJob = await prisma.job.findFirst({
      where: { deviceId },
      orderBy: { completedAt: 'desc' },
    });

    if (!latestJob) {
      return res.status(404).json({ message: 'No job found for this device ID.' });
    }

    res.json({
      deviceId: latestJob.deviceId,
      operatorId: latestJob.operatorId,
      status: latestJob.status,
      cert: latestJob.cert,
      publicKey: latestJob.publicKey,
      error: latestJob.error,
      requestedAt: latestJob.requestedAt,
      completedAt: latestJob.completedAt,
    });
  } catch (err) {
    console.error('Error fetching device status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
