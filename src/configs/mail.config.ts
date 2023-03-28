import { registerAs } from '@nestjs/config';

export default registerAs(
  'mail',
  (): Record<string, any> => ({
    host: process.env.MAILER_HOST,
    port: parseInt(process.env.MAILER_PORT),
    user: process.env.MAILER_USER,
    password: process.env.MAILER_PASS,
    secure: Boolean(process.env.MAILER_SECURE),
    from: process.env.MAILER_FROM,
  }),
);
