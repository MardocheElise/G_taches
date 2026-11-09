// prisma/seed.ts
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { PrismaClient, RoleUtilisateur } from '../src/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const motDePasse = await bcrypt.hash('Admin123456', 10);

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@gestion-projet.com',
    },

    update: {
      role: RoleUtilisateur.SUPER_ADMIN,
    },

    create: {
      nom: 'Admin',
      prenom: 'Super',
      email: 'admin@gestion-projet.com',
      motDePasse,
      role: RoleUtilisateur.SUPER_ADMIN,
    },
  });

  console.log('Super Admin créé :', admin.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
