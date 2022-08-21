/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Req,
  Get,
  Res,
  Body,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards';

import { AuthService } from './auth.service';

import { signUpDto } from './auth.dto';

@Controller('auth')
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

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
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
