import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CommonService } from 'src/common/common.service';
import { PagingDto } from 'src/common/paging.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import * as aggregations from 'prisma/data/aggregations.json';

@Injectable()
export class CoursesService extends CommonService {
  constructor(prisma: PrismaService, private userService: UsersService) {
    super(prisma, 'course');
  }

  async findAllByAuthor(authorId: string, paging: PagingDto) {
    return await this.prisma.course.findMany({
      where: { author: { id: authorId } },
      take: +paging.size,
      skip: +paging.size * +paging.page,
    });
  }
  async findAllWithFilter(filter: string) {
    return await this.prisma.course.findMany({
      where: {},
    });
  }

  getAggregations() {
    return aggregations;
  }

  //crud
  async create(createCourseDto) {
    // try {
    await this.prisma.course
      .create({
        data: {
          ...createCourseDto,
        },
      })
      .catch((error) => {
        throw new BadRequestException(error.message.split('\n').slice(-4)[0]);
      });
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
    return await this.prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
        ratings: true,
      },
    });
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
