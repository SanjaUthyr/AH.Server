import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

class SignInDto {
  @ApiProperty({
    example: 'thang@gmail.com',
    format: 'email',
    uniqueItems: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'thangww123',
    format: 'password',
  })
  // @MinLength(8)
  // @MaxLength(256)
  @IsString()
  @IsNotEmpty()
  password: string;
}

export default SignInDto;
