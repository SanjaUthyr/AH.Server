import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
import fs from 'fs';
import * as categories from './data/category.json';
import * as courses from './data/course.json';
import * as users from './data/user.json';

async function main() {
  console.log(`Start seeding ...`);

  // for (const category of categories.category) {
  //   await prisma.category.create({
  //     data: {
  //       name: category.name,
  //     },
  //   });
  // }

  // for (const user of users.data) {
  //   await prisma.user.create({
  //     data: {
  //       ...user,
  //     },
  //   });
  // }

  // let user;
  // const users1 = await prisma.user.findMany();

  // for (const course of courses.data) {
  //   user = users1[Math.floor(Math.random() * users1.length)];

  //   await prisma.course.create({
  //     data: {
  //       ...course,
  //       authorId: user.id,
  //       previewUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  //       languages: [course.languages],
  //       discountStart: new Date(course.discountStart),
  //       discountEnd: new Date(course.discountEnd),
  //       createdAt: new Date(course.createdAt),
  //       updatedAt: new Date(course.updatedAt),
  //       level: 'all levels',
  //     },
  //   });
  // }
  console.log(`Seeding finished.`);
}

main();
