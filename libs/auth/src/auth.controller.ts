/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Res,
  Body,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';

import { signInDto, signUpDto } from './auth.dto';
import { ApiTags } from '@nestjs/swagger';

@Injectable()
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookLoginCallback(@Req() req, @Res() res) {
    const jwt: string = req.user.jwt;
    if (jwt) {
      res.redirect(
        `${this.configService.get('callbackSuccessUrl')}?code=${jwt}`,
      );
    } else {
      res.redirect(this.configService.get('callbackFailureUrl'));
    }
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubLoginCallback(@Req() req, @Res() res) {
    const jwt: string = req.user.jwt;
    if (jwt) {
      res.redirect(
        `${this.configService.get('callbackSuccessUrl')}?code=${jwt}`,
      );
    } else {
      res.redirect(this.configService.get('callbackFailureUrl'));
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req, @Res() res) {
    const jwt: string = req.user.jwt;
    if (jwt) {
      res.redirect(
        `${this.configService.get('callbackSuccessUrl')}?code=${jwt}`,
      );
    } else {
      res.redirect(this.configService.get('callbackFailureUrl'));
    }
  }

  @Post('login')
  async login(@Body() dto: signInDto) {
    return await this.authService.login(dto);
  }

  @Get('logout')
  logout(@Req() req) {
    req.logout();
  }

  @Post('signup')
  async signup(@Body() dto: signUpDto) {
    return await this.authService.signUp(dto);
  }
}
