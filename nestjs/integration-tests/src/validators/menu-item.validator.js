import { Joi } from '../config/config.js';

export const MenuItemValidator = Joi.object({
  _id: Joi.string().required(),
  fullName: Joi.string().required(),
  shortName: Joi.string().required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().required(),
  image: Joi.string().allow(null),
});
