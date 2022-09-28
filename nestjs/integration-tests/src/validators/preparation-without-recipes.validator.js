import { Joi } from '../config/config.js';

import { PreparedItemWithoutRecipesValidator } from './prepared-item-without-recipes.validator.js';

export const PreparationWithoutRecipesValidator = Joi.object({
  _id: Joi.string().required(),
  tableNumber: Joi.number().required(),
  shouldBeReadyAt: Joi.string().isoDate().required(),
  completedAt: Joi.string().isoDate().allow(null),
  takenForServiceAt: Joi.string().isoDate().allow(null),
  preparedItems: Joi.array().items(PreparedItemWithoutRecipesValidator),
});
