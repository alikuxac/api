import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AES, enc, mode, pad } from 'crypto-js';
import {
  IHelperJwtOptions,
  IHelperJwtVerifyOptions,
} from 'src/common/helper/interfaces/helper.interface';

@Injectable()
export class HelperEncryptionService {
  constructor(private readonly jwtService: JwtService) {}

  base64Encrypt(data: string): string {
    const buff: Buffer = Buffer.from(data, 'utf8');
    return buff.toString('base64');
  }

  base64Decrypt(data: string): string {
    const buff: Buffer = Buffer.from(data, 'base64');
    return buff.toString('utf8');
  }

  base64Compare(clientBasicToken: string, ourBasicToken: string): boolean {
    return ourBasicToken === clientBasicToken;
  }

  aes256Encrypt(
    data: string | Record<string, any> | Record<string, any>[],
    key: string,
    iv: string,
  ): string {
    const cIv = enc.Utf8.parse(iv);
    const cipher = AES.encrypt(JSON.stringify(data), key, {
      mode: mode.CBC,
      padding: pad.Pkcs7,
      iv: cIv,
    });

    return cipher.toString();
  }

  aes256Decrypt(
    encrypted: string,
    key: string,
    iv: string,
  ): string | Record<string, any> | Record<string, any>[] {
    const cIv = enc.Utf8.parse(iv);
    const cipher = AES.decrypt(encrypted, key, {
      mode: mode.CBC,
      padding: pad.Pkcs7,
      iv: cIv,
    });

    return JSON.parse(cipher.toString(enc.Utf8));
  }

  jwtEncrypt(payload: Record<string, any>, options: IHelperJwtOptions): string {
    const result = this.jwtService.sign(payload, {
      secret: options.secretKey,
      expiresIn: options.expiredIn,
      notBefore: options.notBefore ?? 0,
      audience: options.audience,
      issuer: options.issuer,
      subject: options.subject,
    });
    return result;
  }

  jwtDecrypt(token: string): Record<string, any> {
    return this.jwtService.decode(token) as Record<string, any>;
  }

  jwtVerify(token: string, options: IHelperJwtVerifyOptions): boolean {
    console.log('verifying');
    try {
      const result = this.jwtService.verify(token, {
        secret: options.secretKey,
        audience: options.audience,
        issuer: options.issuer,
        subject: options.subject,
      });
      console.log('jwt verify: ', result);
      return true;
    } catch (err: unknown) {
      return false;
    }
  }
}
