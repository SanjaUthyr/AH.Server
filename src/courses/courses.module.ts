import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService, UsersService],
})
export class CoursesModule {}
