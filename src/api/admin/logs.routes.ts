import express from 'express';
import { PrismaClient, JobStatus } from '@prisma/client';
import { verifyJWT, checkRole } from '../../utils/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/admin/logs', verifyJWT, checkRole('admin'), async (req, res) => {
  try {
    const { deviceId, operatorId, status } = req.query;

    const jobs = await prisma.job.findMany({
      where: {
        ...(deviceId ? { deviceId: String(deviceId) } : {}),
        ...(operatorId ? { operatorId: Number(operatorId) } : {}),
        ...(status ? { status: status.toString().toUpperCase() as JobStatus } : {}),
      },
      orderBy: { completedAt: 'desc' },
    });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
