import { Joi } from '../config/config.js';

export const PreparedItemLiteValidator = Joi.object({
  _id: Joi.string().required(),
  shortName: Joi.string().required(),
});
