import dotenv from 'dotenv'
import frisbyInstance from 'frisby';

if (process.env.PROFILE !== undefined) {
  dotenv.config({ path: `.env.${process.env.PROFILE}` });
} else {
  dotenv.config();
}

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
