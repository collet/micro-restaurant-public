import { registerAs } from '@nestjs/config';

export default registerAs('mongodb', () => ({
  host: process.env.MONGODB_HOST,
  port: parseInt(process.env.MONGODB_PORT, 10) || 27017,
  database: process.env.MONGODB_DATABASE,
}));
