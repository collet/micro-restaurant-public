import { Joi } from '../config/config.js';

export const MenuItem = Joi.object({
  _id: Joi.string().required(),
  fullName: Joi.string().required(),
  shortName: Joi.string().required(),
  price: Joi.number().required()
});
