import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
import { writeFile } from 'fs/promises';
import { join } from 'path';
import * as categories from './data/category.json';
import * as courses from './data/course.json';
import * as users from './data/user.json';
import * as agg from './data/aggregations.json';

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

  let user;
  const users1 = await prisma.user.findMany();
  const cate = await prisma.category.findMany();

  for (const course of courses.data.slice(1, 10)) {
    user = users1[Math.floor(Math.random() * users1.length)];
    //random 3 categories
    // const categories = [];
    // for (let i = 0; i < 3; i++) {
    //   categories.push(cate[Math.floor(Math.random() * cate.length)]);
    // }
    // console.log(categories);

    await prisma.course.create({
      data: {
        ...course,
        // categories,
        authorId: user.id,
        previewUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        languages: [course.languages],
        discountStart: new Date(course.discountStart),
        discountEnd: new Date(course.discountEnd),
        createdAt: new Date(course.createdAt),
        updatedAt: new Date(course.updatedAt),
        level:
          agg.aggregations[1].options[
            Math.floor(Math.random() * agg.aggregations[1].options.length)
          ].value,
      },
    });
  }
  console.log(`Seeding finished.`);
}

main();
