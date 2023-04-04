import { registerAs } from '@nestjs/config';

export default registerAs(
  'bot',
  (): Record<string, any> => ({
    discord: {
      prefix: process.env.DISCORD_PREFIX ?? '!',
      token: process.env.DISCORD_TOKEN,
    },
  }),
);
