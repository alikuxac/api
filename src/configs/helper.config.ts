import { registerAs } from '@nestjs/config';
import { seconds } from '@root/common/helper/constants/helper.function.constant';

export default registerAs(
  'helper',
  (): Record<string, any> => ({
    jwt: {
      secretKey: process.env.JWT_SECRET,
      expirationTime: seconds('1h'),
      notBeforeExpirationTime: seconds('0'),
    },
  }),
);
