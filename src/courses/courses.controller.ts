import { JwtGuard } from './../auth/guards/jwt.guard';
import { PagingDto } from './../common/paging.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CoursesService } from './courses.service';
import { FilterDto } from './dto/filter.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get('/aggregations')
  async getAggregations() {
    return await this.coursesService.getAggregations();
  }

  @Post('/filters')
  @UseGuards(AuthGuard(['jwt', 'anonymous']))
  async getByAuthorId(@Request() req, @Body() filter: FilterDto) {
    return await this.coursesService.findAllWithFilter(req.user.id, filter);
  }

  @Post('/add-wishlist')
  @UseGuards(JwtGuard)
  async addToWishlist(@Request() req, @Body() data) {
    return await this.coursesService.addToWishlist(req.user.id, data.courseId);
  }

  @Post('/delete-wishlist')
  @UseGuards(JwtGuard)
  async deleteWishlist(@Request() req, @Body() data) {
    return await this.coursesService.deleteWishlist(req.user.id, data.courseId);
  }

  @Post('wishlist')
  @UseGuards(JwtGuard)
  async getWishlist(@Request() req, @Body() paging: PagingDto) {
    return await this.coursesService.getWishlist(req.user.id);
  }

  @Post('/add-cart')
  @UseGuards(JwtGuard)
  async addToCart(@Request() req, @Body() data) {
    console.log(req.user, data);
    return await this.coursesService.addToCart(req.user.id, data.courseId);
  }

  @Post('/delete-Cart')
  @UseGuards(JwtGuard)
  async deleteCart(@Request() req, @Body() data) {
    return await this.coursesService.deleteCart(req.user.id, data.courseId);
  }

  @Post('cart')
  @UseGuards(JwtGuard)
  async getCart(@Request() req, @Body() paging: PagingDto) {
    return await this.coursesService.getCart(req.user.id);
  }

  //crud
  @Post()
  @UseGuards(JwtGuard)
  create(@Request() req, @Body() createCourseDto: Prisma.CourseCreateInput) {
    return this.coursesService.create(req.user.id, createCourseDto);
  }

  // @Post('/all')
  // findAll(@Body() paging: PagingDto) {
  //   return this.coursesService.findAll(paging);
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Get('/in-cart/:id')
  @UseGuards(AuthGuard(['jwt']))
  checkCourseInCart(@Request() req, @Param('id') id: string) {
    return this.coursesService.findOneWithUserId(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: Prisma.CourseUpdateInput,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
