import { Recipe } from '../schemas/recipe.schema';
import { ItemToBeCookedDto } from '../../preparations/dto/item-to-be-cooked.dto';


export interface RecipeWithItemToBeCookedInterface {
  recipe: Recipe;

  itemToBeCooked: ItemToBeCookedDto;
}
