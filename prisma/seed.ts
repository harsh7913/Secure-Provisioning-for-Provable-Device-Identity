// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  await prisma.user.createMany({
    data: [
      {
        name: 'harsh Admin',
        email: 'admin@gmail.com',
        role: 'ADMIN',
        passwordHash: password,
      },
      {
        name: 'harsh Operator',
        email: 'operator@gmail.com',
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
