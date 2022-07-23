import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ResetTokenDto } from './dto/reset-token.dto';
import SignInDto from './dto/sign-in.dto';
import SignUpDto from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Request() req, @Body() data: SignInDto) {
    return this.authService.signIn(data);
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() data: SignUpDto) {
    return this.authService.signUp(data);
  }

  @Post('reset-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset access Token' })
  @ApiOkResponse({})
  async resetToken(@Body() data: ResetTokenDto) {
    return await this.authService.resetToken(data.refreshToken);
  }
}
