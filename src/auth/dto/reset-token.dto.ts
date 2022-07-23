import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetTokenDto {
  @ApiProperty({
    example: '',
    description: 'Refresh Token of the User',
    format: 'string',
  })
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;
}
