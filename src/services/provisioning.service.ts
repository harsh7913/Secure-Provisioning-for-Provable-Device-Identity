import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuditEntry {
  deviceId: string;
  operatorId: number;
  cert: string;
  publicKey: string;
  privateKey: string;
}

export async function saveAuditLog(entry: AuditEntry) {
  try {
    await prisma.job.create({
      data: {
        deviceId: entry.deviceId,
        operatorId: entry.operatorId,
        cert: entry.cert,
        publicKey: entry.publicKey,
        privateKey: entry.privateKey,
        status: 'COMPLETED',
        requestedAt: new Date(),
        completedAt: new Date(),
      },
    });
    console.log('✅ Audit log saved to DB for device:', entry.deviceId);
  } catch (error) {
    console.error('❌ Failed to save audit log:', error);
  }
}
