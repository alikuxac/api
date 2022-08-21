import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Profile
import { Profile as fbProfile } from 'passport-facebook';
import { Profile as googleProfile } from 'passport-google-oauth20';
import { Profile as discordProfile } from 'passport-discord';
import { Profile as githubProfile } from 'passport-github';

import { UsersService } from '@users';
import { User } from '@users/entities/user.entity';
import { signUpDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateFacebookLogin(profile: fbProfile) {
    const { id, emails, name } = profile;
    let existFBUser = await this.usersService.findByProviderId('facebook', id);
    if (!existFBUser) {
      existFBUser = await this.usersService.create({
        providers: [
          {
            provider: 'facebook',
            providerId: id,
            name: name.givenName,
          },
        ],
        email: emails[0].value,
        displayName: name.givenName + ' ' + name.familyName,
      });
    }
  }

  async validateGoogleLogin(profile: googleProfile) {
    const { id, emails, name } = profile;
    let existGoogleUser = await this.usersService.findByProviderId(
      'google',
      id,
    );
    if (!existGoogleUser) {
      existGoogleUser = await this.usersService.create({
        providers: [
          {
            provider: 'google',
            providerId: id,
            name: name.givenName,
          },
        ],
        email: emails[0].value,
        displayName: name.givenName + ' ' + name.familyName,
      });
    }
  }

  async validateDiscordLogin(profile: discordProfile) {
    const { id, username, displayName, email } = profile;
    let existDiscordUser = await this.usersService.findByProviderId(
      'discord',
      id,
    );
    if (!existDiscordUser) {
      existDiscordUser = await this.usersService.create({
        providers: [
          {
            provider: 'discord',
            providerId: id,
            name: username,
          },
        ],
        email,
        displayName: displayName,
      });
    }
  }

  async validateGithubLogin(profile: githubProfile) {
    const { id, username, displayName, emails } = profile;
    let existGithubUser = await this.usersService.findByProviderId(
      'github',
      id,
    );
    if (!existGithubUser) {
      existGithubUser = await this.usersService.create({
        providers: [
          {
            provider: 'github',
            providerId: id,
            name: username,
          },
        ],
        email: emails[0].value,
        displayName: displayName,
      });
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await user.comparePassword(password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(dto: signUpDto) {
    const checkUser = await this.usersService.findByEmail(dto.email);
    if (checkUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersService.create(dto);
    return user;
  }
}