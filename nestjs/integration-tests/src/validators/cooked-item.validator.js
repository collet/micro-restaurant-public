import { Joi } from '../config/config.js';

export const CookedItemValidator = Joi.object({
  _id: Joi.string().required(),
  readyToServe: Joi.string().isoDate().required(),
});
