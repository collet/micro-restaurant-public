import { Joi } from '../config/config.js';

export const RecipeValidator = Joi.object({
  _id: Joi.string().required(),
  shortName: Joi.string().required(),
  post: Joi.string().required(),
  cookingSteps: Joi.array().items(Joi.string()).required(),
  meanCookingTimeInSec: Joi.number().min(0).required(),
});
