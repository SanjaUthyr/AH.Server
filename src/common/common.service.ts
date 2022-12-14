import { PrismaService } from './../prisma/prisma.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PagingDto } from './paging.dto';

@Injectable()
export abstract class CommonService {
  constructor(public prisma: PrismaService, private route: string) {}

  async create(createCommonDto, callback) {
    const newItem = await this.prisma[this.route].create({
      data: {
        ...createCommonDto,
      },
    });

    if (callback) {
      callback(newItem.id);
    }
  }

  async findAll(paging?: PagingDto) {
    return await this.prisma[this.route].findMany();
  }

  async findOne(id: string) {
    return await this.prisma[this.route].findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateDto) {
    try {
      await this.prisma[this.route].update({
        where: {
          id,
        },
        data: {
          ...updateDto,
        },
      });
    } catch (error) {
      throw new BadRequestException(this.route + ' not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma[this.route].delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new BadRequestException(this.route + ' not found');
    }
  }
}
