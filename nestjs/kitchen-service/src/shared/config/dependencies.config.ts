import { registerAs } from '@nestjs/config';

export default registerAs('dependencies', () => ({
  dining_service_url_with_port: process.env.DINING_SERVICE_URL_WITH_PORT,
}));
