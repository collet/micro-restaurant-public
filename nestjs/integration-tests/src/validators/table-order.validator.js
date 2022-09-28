import { Joi } from '../config/config.js';

import { PreparationLiteValidator } from './preparation-lite.validator.js';

export const TableOrderValidator = Joi.object({
  _id: Joi.string().required(),
  tableNumber: Joi.number().required(),
  customersCount: Joi.number().min(0).required(),
  opened: Joi.string().isoDate().required(),
  lines: Joi.array().items(
    Joi.object({
      item: Joi.object({
        _id: Joi.string().required(),
        shortName: Joi.string().required(),
      }),
      howMany: Joi.number().min(0).required(),
      sentForPreparation: Joi.boolean().required(),
    })
  ),
  preparations: Joi.array().items(
    PreparationLiteValidator
  ),
  billed: Joi.string().isoDate().allow(null),
});
