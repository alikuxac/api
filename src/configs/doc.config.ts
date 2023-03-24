import { registerAs } from '@nestjs/config';

import packageJson from 'package.json';

export default registerAs(
  'doc',
  (): Record<string, any> => ({
    title: 'Alikuxac API',
    description: 'Alikuxac API',
    prefix: '/docs',
    version: packageJson.version,
  }),
);
