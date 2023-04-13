import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HelperEncryptionService } from 'src/common/helper/services/helper.encryption.service';
import { HelperHashService } from 'src/common/helper/services/helper.hash.service';
import { HelperDateService } from '@root/common/helper/services/helper.date.service';
import {
  IAuthRefreshTokenOptions,
  IAuthPayloadOptions,
} from '../interfaces/auth.interface';

@Injectable()
export class AuthService {
  private readonly accessTokenSecretKey: string;
  private readonly accessTokenExpirationTime: number;
  private readonly accessTokenNotBeforeExpirationTime: number;

  private readonly refreshTokenSecretKey: string;
  private readonly refreshTokenExpirationTime: number;
  private readonly refreshTokenExpirationTimeRememberMe: number;
  private readonly refreshTokenNotBeforeExpirationTime: number;

  private readonly prefixAuthorization: string;
  private readonly audience: string;
  private readonly issuer: string;
  private readonly subject: string;

  private readonly passwordExpiredIn: number;
  private readonly passwordSaltLength: number;

  private readonly secretKey: string;
  private readonly expiredIn: string;

  constructor(
    private readonly helperDateService: HelperDateService,
    private readonly helperHashService: HelperHashService,
    private readonly helperEncryptionService: HelperEncryptionService,
    private readonly configService: ConfigService,
  ) {
    this.subject = this.configService.get<string>('auth.subject');
    this.audience = this.configService.get<string>('auth.audience');
    this.issuer = this.configService.get<string>('auth.issuer');
    this.prefixAuthorization = this.configService.get<string>(
      'auth.prefixAuthorization',
    );

    this.accessTokenExpirationTime = this.configService.get<number>(
      'auth.accessToken.expried',
    );
    this.accessTokenNotBeforeExpirationTime = this.configService.get<number>(
      'auth.accessToken.notBeforeExpiration',
    );

    this.refreshTokenSecretKey = this.configService.get<string>(
      'auth.refeshToken.secretKey',
    );
    this.refreshTokenExpirationTime = this.configService.get<number>(
      'auth.refreshToken.expried',
    );
    this.refreshTokenExpirationTimeRememberMe = this.configService.get<number>(
      'auth.refreshToken.rememberMeExprired',
    );
    this.refreshTokenNotBeforeExpirationTime = this.configService.get<number>(
      'auth.refreshToken.notBeforeExpiration',
    );

    this.secretKey = this.configService.get('auth.jwt_secret');
    this.expiredIn = this.configService.get('auth.jwt_expires');
  }

  async createAccessToken(
    payloadHashed: string | Record<string, any>,
  ): Promise<string> {
    return this.helperEncryptionService.jwtEncrypt(
      { data: payloadHashed },
      {
        secretKey: this.secretKey,
        expiredIn: this.accessTokenExpirationTime,
        notBefore: this.accessTokenNotBeforeExpirationTime,
        audience: this.audience,
        issuer: this.issuer,
        subject: this.subject,
      },
    );
  }

  async validateAccessToken(token: string): Promise<boolean> {
    return this.helperEncryptionService.jwtVerify(token, {
      secretKey: this.accessTokenSecretKey,
      audience: this.audience,
      issuer: this.issuer,
      subject: this.subject,
    });
  }

  async payloadAccessToken(token: string): Promise<Record<string, any>> {
    return this.helperEncryptionService.jwtDecrypt(token);
  }

  async createRefreshToken(
    payloadHashed: string | Record<string, any>,
    options?: IAuthRefreshTokenOptions,
  ): Promise<string> {
    return this.helperEncryptionService.jwtEncrypt(
      { data: payloadHashed },
      {
        secretKey: this.secretKey,
        expiredIn: options?.rememberMe
          ? this.refreshTokenExpirationTimeRememberMe
          : this.refreshTokenExpirationTime,
        notBefore:
          options?.notBeforeExpirationTime ??
          this.refreshTokenNotBeforeExpirationTime,
        audience: this.audience,
        issuer: this.issuer,
        subject: this.subject,
      },
    );
  }

  async validateRefreshToken(token: string): Promise<boolean> {
    return this.helperEncryptionService.jwtVerify(token, {
      secretKey: this.refreshTokenSecretKey,
      audience: this.audience,
      issuer: this.issuer,
      subject: this.subject,
    });
  }

  async payloadRefreshToken(token: string): Promise<Record<string, any>> {
    return this.helperEncryptionService.jwtDecrypt(token);
  }

  async validateUser(
    passwordString: string,
    passwordHash: string,
  ): Promise<boolean> {
    return this.helperHashService.bcryptCompare(passwordString, passwordHash);
  }

  async createPayloadAccessToken(
    data: Record<string, any>,
    rememberMe: boolean,
    options?: IAuthPayloadOptions,
  ): Promise<Record<string, any>> {
    return {
      ...data,
      rememberMe,
      loginDate: options?.loginDate ?? this.helperDateService.create(),
    };
  }

  async createPayloadRefreshToken(
    _id: string,
    rememberMe: boolean,
    options?: IAuthPayloadOptions,
  ): Promise<Record<string, any>> {
    return {
      _id,
      rememberMe,
      loginDate: options?.loginDate,
    };
  }

  async getTokenType(): Promise<string> {
    return this.prefixAuthorization;
  }

  async getAccessTokenExpirationTime(): Promise<number> {
    return this.accessTokenExpirationTime;
  }

  async getRefreshTokenExpirationTime(rememberMe?: boolean): Promise<number> {
    return rememberMe
      ? this.refreshTokenExpirationTimeRememberMe
      : this.refreshTokenExpirationTime;
  }

  async getIssuer(): Promise<string> {
    return this.issuer;
  }

  async getAudience(): Promise<string> {
    return this.audience;
  }

  async getSubject(): Promise<string> {
    return this.subject;
  }

  getSecretKey(): string {
    return this.secretKey;
  }
}
