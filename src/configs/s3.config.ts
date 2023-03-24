import { registerAs } from '@nestjs/config';

export default registerAs('s3', (): Record<string, any> => ({}));
