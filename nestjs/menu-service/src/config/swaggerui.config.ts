import { registerAs } from '@nestjs/config';

export default registerAs('swaggerui', () => ({
  path: process.env.SWAGGERUI_PATH,
}));
