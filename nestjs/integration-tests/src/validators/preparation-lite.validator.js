import { Joi } from '../config/config.js';

import { PreparedItemLiteValidator } from './prepared-item-lite.validator.js';

export const PreparationLiteValidator = Joi.object({
  _id: Joi.string().required(),
  shouldBeReadyAt: Joi.string().isoDate().required(),
  preparedItems: Joi.array().items(PreparedItemLiteValidator),
});
