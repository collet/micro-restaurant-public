import { registerAs } from '@nestjs/config';

export default registerAs('swaggerui', () => ({
  path: process.env.SWAGGERUI_PATH,
  title: process.env.SWAGGERUI_TITLE,
  description: process.env.SWAGGERUI_DESCRIPTION,
}));
