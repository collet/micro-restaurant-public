import { Joi } from '../config/config.js';

import { PreparedItemValidator } from './prepared-item.validator.js';

export const PreparationValidator = Joi.object({
  _id: Joi.string().required(),
  tableNumber: Joi.number().required(),
  shouldBeReadyAt: Joi.string().isoDate().required(),
  completedAt: Joi.string().isoDate().allow(null),
  takenForServiceAt: Joi.string().isoDate().allow(null),
  preparedItems: Joi.array().items(PreparedItemValidator),
});
