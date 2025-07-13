import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Creates a new job record in the database with status 'QUEUED'
 */
export async function createJobRecord(deviceId: string, operatorId: number) {
  try {
    const job = await prisma.job.create({
      data: {
        deviceId,
        operatorId,
        status: 'QUEUED',
        requestedAt: new Date(),
      },
    });
    console.log(`📥 Job queued for device ${deviceId} (job ID: ${job.id})`);
    return job;
  } catch (error) {
    console.error('❌ Failed to create job record:', error);
    throw error;
  }
}

/**
 * Updates the job record with provisioning results or status changes
 */
export async function updateJobStatus(
  jobId: number,
  updates: Partial<{
    status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    cert: string;
    publicKey: string;
    error: string;
  }>
) {
  try {
    const job = await prisma.job.update({
      where: { id: jobId },
      data: {
        ...updates,
        completedAt:
          updates.status === 'COMPLETED' || updates.status === 'FAILED'
            ? new Date()
            : undefined,
      },
    });

    console.log(`🔄 Job ${jobId} updated to status: ${updates.status}`);
    return job;
  } catch (error) {
    console.error(`❌ Failed to update job ${jobId}:`, error);
    throw error;
  }
}
