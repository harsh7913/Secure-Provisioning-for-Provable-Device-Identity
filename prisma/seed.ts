// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  await prisma.user.createMany({
    data: [
      {
        name: 'Alice Admin',
        email: 'admin@example.com',
        role: 'ADMIN',
        passwordHash: password,
      },
      {
        name: 'Oscar Operator',
        email: 'operator@example.com',
        role: 'OPERATOR',
        passwordHash: password,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed data created.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
