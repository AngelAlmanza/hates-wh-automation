import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('$Demo1234', 10);

  const user = await prisma.user.upsert({
    where: { username: 'pariente' },
    update: {},
    create: {
      username: 'pariente',
      passwordHash,
      displayName: 'Pariente',
    },
  });

  console.log('Seeded user:', user.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
