import { Joi } from '../config/config.js';

export const Table = Joi.object({
  _id: Joi.string().required(),
  number: Joi.number().required(),
  taken: Joi.boolean().required(),
});
