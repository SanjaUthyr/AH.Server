import { Prisma, Course, Role } from '@prisma/client';
import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { PagingDto } from 'src/common/paging.dto';

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
      // select: {
      //   password: false,
      // },
    });
  }
  async findWishlistCart(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        wishlist: true,
        cart: true,
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

  async addWishlist(userId: string, courseId: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        wishlist: {
          connect: {
            id: courseId,
          },
        },
      },
    });
  }
  async deleteWishlist(userId: string, courseId: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        wishlist: {
          disconnect: {
            id: courseId,
          },
        },
      },
    });
  }

  async addToCart(userId: string, courseId: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        cart: {
          connect: {
            id: courseId,
          },
        },
      },
    });
  }
  async deleteCart(userId: string, courseId: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        cart: {
          // disconnect: {
          //   id: courseId,
          // },
        },
      },
    });
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

  async getWishlist(userId: string, paging: PagingDto) {
    return await this.prisma.user.findMany({
      where: {
        id: userId,
      },
      select: {
        wishlist: true,
      },
      take: +paging.size,
      skip: +paging.size * +paging.page,
    });
  }
}
