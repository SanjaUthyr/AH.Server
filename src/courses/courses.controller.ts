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

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get('/aggregations')
  async getAggregations() {
    return await this.coursesService.getAggregations();
  }

  @Post('/filters')
  async getByAuthorId(@Body() filter: FilterDto) {
    return await this.coursesService.findAllWithFilter(filter);
  }

  //crud
  @Post()
  @UseGuards(JwtGuard)
  create(@Request() req, @Body() createCourseDto: Prisma.CourseCreateInput) {
    console.log(req.user);
    return this.coursesService.create(req.user.id, createCourseDto);
  }

  @Get()
  findAll(@Body() paging: PagingDto) {
    return this.coursesService.findAll(paging);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
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
