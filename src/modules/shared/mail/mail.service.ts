import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { customAlphabet } from 'nanoid';
import nodemailer, { Transporter } from 'nodemailer';
import { RedisService } from '../redis/redis.service';

// const nanoid = customAlphabet(
//   '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
//   10,
// );

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      // secure: this.configService.get('MAIL_SECURE'),
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
      tls: { ciphers: this.configService.get('MAIL_TTL') },
    });
  }
}
