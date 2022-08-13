import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  name: process.env.APP_NAME,
}));
