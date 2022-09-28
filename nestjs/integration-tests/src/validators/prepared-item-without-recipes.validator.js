import { Joi } from '../config/config.js';

export const PreparedItemWithoutRecipesValidator = Joi.object({
  _id: Joi.string().required(),
  shortName: Joi.string().required(),
  shouldStartAt: Joi.string().isoDate().required(),
  startedAt: Joi.string().isoDate().allow(null),
  finishedAt: Joi.string().isoDate().allow(null),
});
