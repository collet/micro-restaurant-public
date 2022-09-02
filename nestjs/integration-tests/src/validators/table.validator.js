import { Joi } from '../config/config.js';

export const TableValidator = Joi.object({
  _id: Joi.string().required(),
  number: Joi.number().required(),
  taken: Joi.boolean().required(),
  tableOrderId: Joi.string().allow(null),
});
