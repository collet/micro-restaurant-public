import { Joi } from '../config/config.js';

import { RecipeValidator } from './recipe.validator.js';

export const PreparedItemValidator = Joi.object({
  _id: Joi.string().required(),
  shortName: Joi.string().required(),
  recipe: RecipeValidator,
  shouldStartAt: Joi.string().isoDate().required(),
  startedAt: Joi.string().isoDate().allow(null),
  finishedAt: Joi.string().isoDate().allow(null),
});
