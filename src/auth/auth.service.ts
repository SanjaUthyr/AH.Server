import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import SignInDto from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signUp(data: Prisma.UserCreateInput) {
    const password = await bcrypt.hash(data.password, 10);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password,
          fullName: data.fullName,
        },
      });

      delete user.password;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // throw new ForbiddenException('Credentials taken');
          throw new ForbiddenException('Email is already taken');
        }
      }
      throw error;
    }
  }
  async signToken(userId: string, email: string, type: string) {
    const payload = {
      id: userId,
      email,
      roles: [Role.ADMIN],
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload);

    return token;
  }

  async signIn(data: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      throw new ForbiddenException('Password is incorrect');
    }
    delete user.password;
    return {
      accessToken: await this.signToken(user.id, user.email, 'access'),
      refreshToken: await this.signToken(user.id, user.email, 'refresh'),
    };
  }

  async resetToken(refreshToken: string) {
    const payload: any = this.jwt.decode(refreshToken);
    //handle access token expired and refresh token not expired
    if (payload.exp > Date.now() / 1000) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.id,
        },
      });
      const accessToken = await this.signToken(user.id, user.email, 'access');

      return { accessToken };
    } else throw new ConflictException('Refresh token has been expired');
  }
}
