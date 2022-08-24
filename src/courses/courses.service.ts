import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Course } from '@prisma/client';
import { CommonService } from 'src/common/common.service';
import { PagingDto } from 'src/common/paging.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import * as aggregations from 'prisma/data/aggregations.json';
import { FilterDto } from './dto/filter.dto';
import { triggerAsyncId } from 'async_hooks';

@Injectable()
export class CoursesService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
  ) {}

  filterItems(item, key) {
    return item.map((p) => ({
      [key]: {
        equals: p,
      },
    }));
  }

  // getValPrice(prices) {
  //   if()
  // }
  async findAllWithFilter(userId: string, filter: FilterDto) {
    const price = this.filterItems(filter.prices, 'price');
    // const categories = this.filterItems(filter.categories, 'category');
    const levels = this.filterItems(filter.levels, 'level');
    const languages = this.filterItems(filter.languages, 'languages');
    // const skills = this.filterItems(filter.skills, 'skill');
    const durations = this.filterItems(filter.durations, 'duration');
    const ratings = this.filterItems(filter.ratings, 'ratings');

    // const user = await this.userService.findWishlistCart(userId);

    // if (!user) {
    //   throw new NotFoundException('User not found');
    // }

    let res: any = await this.prisma.course.findMany({
      where: {
        AND: [
          filter.authorId === ''
            ? {}
            : {
                authorId: {
                  equals: filter.authorId,
                },
              },
          ,
          ...languages,
          // ...categories,
          ...levels,
          // ...skills,
          ...durations,
          // ...ratings,
        ],
      },
      include: {
        author: true,
        ratings: true,
      },
      take: +filter.size,
      skip: +filter.size * +filter.page,
    });

    let sum;
    // sum of ratings in course
    res = res.filter((item) => {
      sum =
        item.ratings.reduce(
          (total, curr) => total + parseFloat(curr.rating),
          0,
        ) / item.ratings.length;

      return (
        filter.ratings.filter((rating) => sum >= +rating && sum < +rating + 0.5)
          .length > 0
      );
    });
    // return {
    //   courses: res,
    //   pages: Math.floor((await this.prisma.course.count()) / +filter.size),
    //   count: await this.prisma.course.count(),
    // };
    return !filter.clearAll
      ? {
          courses: res,
          pages: Math.floor((await this.prisma.course.count()) / +filter.size),
          count: res.length,
        }
      : await this.findAll(userId, { page: filter.page, size: filter.size });
  }

  getAggregations() {
    return aggregations;
  }

  async addToWishlist(userId: string, courseId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const course = await this.findOne(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    await this.userService.addWishlist(userId, courseId);
  }

  async deleteWishlist(userId: string, courseId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const course = await this.findOne(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    await this.userService.deleteWishlist(userId, courseId);
  }

  async getWishlist(userId: string) {
    const wishlist = await this.userService.findWishlist(userId);
    if (!wishlist) {
      throw new NotFoundException('User not found');
    }

    return wishlist;
  }

  async addToCart(userId: string, courseId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const course = await this.findOne(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    await this.userService.addToCart(userId, courseId);
  }

  async deleteCart(userId: string, courseId: string) {
    console.log(userId, courseId);
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const course = await this.findOne(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    await this.userService.deleteCart(userId, courseId);
  }

  async getCart(userId: string) {
    const cart = await this.userService.getCart(userId);
    if (!cart) {
      throw new NotFoundException('User not found');
    }

    return cart;
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

  async findAll(userId: string, paging: PagingDto) {
    const wishlist = await this.userService.findWishlist(userId ? userId : '');
    const cart = await this.userService.getCart(userId ? userId : '');
    return {
      courses: (
        await this.prisma.course.findMany({
          take: +paging.size,
          skip: +paging.size * +paging.page,
          include: {
            author: true,
            ratings: true,
          },
        })
      ).map((course) => ({
        ...course,
        inWishlist: !wishlist
          ? false
          : wishlist.filter((item) => item.id == course.id).length > 0,
        inCart: !cart
          ? false
          : cart.courses.filter((item) => item.id == course.id).length > 0,
      })),
      pages: Math.floor((await this.prisma.course.count()) / +paging.size),
      count: await this.prisma.course.count(),
    };
  }

  async findOneWithUserId(userId: string, id: string) {
    const res = await this.prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
        // ratings: true,
      },
    });

    const cart = await this.userService.getCart(userId ? userId : '');

    if (!res) {
      throw new NotFoundException('Course not found');
    }
    return {
      inCart: !cart
        ? false
        : cart.courses.filter((item) => item.id == res.id).length > 0,
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
