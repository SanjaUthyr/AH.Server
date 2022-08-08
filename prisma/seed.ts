import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
import fs from 'fs';
import * as categories from './category.json';

async function main() {
  console.log(`Start seeding ...`);

  //   const categories = JSON.parse(fs.readFileSync('./categories.json', 'utf8'));

  for (const category of categories.category) {
    await prisma.category.create({
      data: {
        name: category.name,
      },
    });
  }
  console.log(`Seeding finished.`);
}

main();
