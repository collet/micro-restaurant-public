import 'dotenv/config';
import frisbyInstance from 'frisby';

frisbyInstance.globalSetup({
  request: {
    headers: {
      'Content-Type': 'application/json',
    }
  }
});

export const frisby = frisbyInstance;

export const Joi = frisby.Joi;

export const getMenuServiceBaseUrl = () => (process.env.MENU_SERVICE_URL_WITH_PORT);

export const getDiningServiceBaseUrl = () => (process.env.DINING_SERVICE_URL_WITH_PORT);

export const getKitchenServiceBaseUrl = () => (process.env.KITCHEN_SERVICE_URL_WITH_PORT);
