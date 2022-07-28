import { Prisma, Course } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // async create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  async findAll() {
    return await this.prisma.user.findMany().then((users) => {
      return users.map((user: any) => {
        delete user.password;
        return user;
      });
    });
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    try {
      await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          ...updateUserDto,
        },
      });
    } catch (error) {
      throw new BadRequestException('User not found');
    }
  }

  async updateAuthor(id: string, courseId: string) {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        createdCourses: {
          connect: {
            id: courseId,
          },
        },
      },
    });
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new BadRequestException('User not found');
    }
  }
}
