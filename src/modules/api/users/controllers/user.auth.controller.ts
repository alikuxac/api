/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Controller,
  Post,
  Req,
  Get,
  Body,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '@root/common/auth/services/auth.service';
import { UsersService } from 'src/modules/api/users/services/users.service';

import { signInDto, signUpDto } from 'src/modules/api/users/dto/user.auth.dto';
import { ApiTags } from '@nestjs/swagger';

@Injectable()
@Controller('auth')
@ApiTags('Auth')
export class UserAuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async login(@Body() { email, password, rememberMe = false }: signInDto) {
    const user = await this.usersService.findByUsernameOrEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const validate: boolean = await this.authService.validateUser(
      password,
      user.password,
    );
    if (!validate) {
      throw new UnauthorizedException('Wrong password');
    }

    const payload = { _id: user._id, username: user.username };
    const tokenType: string = await this.authService.getTokenType();
    const expiresIn: number =
      await this.authService.getAccessTokenExpirationTime();

    const payloadAccessToken: Record<string, any> =
      await this.authService.createPayloadAccessToken(payload, rememberMe);
    const payloadRefreshToken: Record<string, any> =
      await this.authService.createPayloadRefreshToken(
        payload._id,
        rememberMe,
        {
          loginDate: payloadAccessToken.loginDate,
        },
      );

    const accessToken: string = await this.authService.createAccessToken(
      payloadAccessToken,
    );

    const refreshToken: string = await this.authService.createRefreshToken(
      payloadRefreshToken,
      { rememberMe },
    );

    return {
      tokenType,
      expiresIn,
      accessToken,
      refreshToken,
    };
  }

  @Get('logout')
  logout(@Req() req) {
    req.logout();
  }

  @Post('signup')
  async signup(@Body() dto: signUpDto) {
    const checkUser = await this.usersService.findByEmail(dto.email);
    if (checkUser) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.usersService.create(dto);
    const payload = { id: user._id, email: user.email, role: user.role };
    const tokenType: string = await this.authService.getTokenType();
    const expiresIn: number =
      await this.authService.getAccessTokenExpirationTime();
    const payloadAccessToken: Record<string, any> =
      await this.authService.createPayloadAccessToken(payload, false);
    const payloadRefreshToken: Record<string, any> =
      await this.authService.createPayloadRefreshToken(payload.id, false, {
        loginDate: payloadAccessToken.loginDate,
      });
    const payloadEncryption = await this.authService.getPayloadEncryption();
    let payloadHashedAccessToken: Record<string, any> | string =
      payloadAccessToken;
    let payloadHashedRefreshToken: Record<string, any> | string =
      payloadRefreshToken;

    if (payloadEncryption) {
      payloadHashedAccessToken = await this.authService.encryptAccessToken(
        payloadAccessToken,
      );
      payloadHashedRefreshToken = await this.authService.encryptRefreshToken(
        payloadRefreshToken,
      );
    }

    const accessToken: string = await this.authService.createAccessToken(
      payloadHashedAccessToken,
    );

    const refreshToken: string = await this.authService.createRefreshToken(
      payloadHashedRefreshToken,
    );

    return {
      tokenType,
      expiresIn,
      accessToken,
      refreshToken,
    };
  }
}
