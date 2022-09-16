import { registerAs } from '@nestjs/config';

export default registerAs('dependencies', () => ({
  menu_service_url_with_port: process.env.MENU_SERVICE_URL_WITH_PORT,
  kitchen_service_url_with_port: process.env.KITCHEN_SERVICE_URL_WITH_PORT,
  dining_service_url_with_port: process.env.DINING_SERVICE_URL_WITH_PORT,
  react_ui_waiter_url_with_port: process.env.REACT_UI_WAITER_URL_WITH_PORT,
}));
