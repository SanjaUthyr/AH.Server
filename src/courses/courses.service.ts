import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CommonService } from 'src/common/common.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService extends CommonService {
  constructor(prisma: PrismaService, private userService: UsersService) {
    super(prisma, 'course');
  }

  async create(createCourseDto) {
    const course = await this.prisma.course.create({
      data: {
        ...createCourseDto,
      },
    });

    return await this.userService.updateAuthor(
      '3423bb9a-061d-40ea-90eb-160c63ff8e67',
      course.id,
    );
  }

  async findAll() {
    return await this.prisma.course.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.course.findUnique({
      where: {
        id,
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
