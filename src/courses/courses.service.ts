import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CommonService } from 'src/common/common.service';
import { PagingDto } from 'src/common/paging.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import * as aggregations from 'prisma/data/aggregations.json';
import { FilterDto } from './dto/filter.dto';

@Injectable()
export class CoursesService extends CommonService {
  constructor(prisma: PrismaService, private userService: UsersService) {
    super(prisma, 'course');
  }

  filterItems(item, key) {
    return item.map((p) => ({
      [key]: {
        equals: p,
      },
    }));
  }
  async findAllWithFilter(filter: FilterDto) {
    const price = this.filterItems(filter.prices, 'price');
    // const categories = this.filterItems(filter.categories, 'category');
    // const levels = this.filterItems(filter.levels, 'level');
    // const languages = this.filterItems(filter.languages, 'language');
    // const skills = this.filterItems(filter.skills, 'skill');
    // const durations = this.filterItems(filter.durations, 'duration');
    // const ratings = this.filterItems(filter.ratings, 'rating');

    return await this.prisma.course.findMany({
      where: {
        OR: [
          {
            authorId: {
              equals: filter.authorId,
            },
          },
          ...price,
          // ...categories,
          // ...levels,
          // ...languages,
          // ...skills,
          // ...durations,
          // ...ratings,
        ],
      },
      select: {
        id: true,
        authorId: true,
        price: true,
      },
    });
  }

  getAggregations() {
    return aggregations;
  }

  async addToWishlist(userId: string, courseId: string) {
    const user = await this.userService.findOne(userId);
    console.log(user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const course = await this.findOne(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    await this.userService.addWishlist(userId, courseId);
  }

  async getWishlist(userId: string) {
    const user = await this.userService.findWishlist(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.wishlist;
  }
  //crud
  async create(userId: string, createCourseDto) {
    const course = await this.prisma.course
      .create({
        data: {
          ...createCourseDto,
        },
      })
      .catch((error) => {
        throw new BadRequestException(error.message.split('\n').slice(-4)[0]);
      });

    await this.userService.updateAuthor(userId, course.id);
  }

  async findAll(paging: PagingDto) {
    return {
      courses: await this.prisma.course.findMany({
        take: +paging.size,
        skip: +paging.size * +paging.page,
        include: {
          author: true,
          ratings: true,
        },
      }),
      pages: Math.floor((await this.prisma.course.count()) / +paging.size),
      count: await this.prisma.course.count(),
    };
  }

  async findOne(id: string) {
    const res = await this.prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
        // ratings: true,
      },
    });
    if (!res) {
      throw new NotFoundException('Course not found');
    }
    return res;
  }

  async update(id: string, updateUserDto: Prisma.CourseUpdateInput) {
    try {
      await this.prisma.course.update({
        where: {
          id,
        },
        data: {
          ...updateUserDto,
        },
      });
    } catch (error) {
      throw new BadRequestException('Course not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.course.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new BadRequestException('Course not found');
    }
  }
}
