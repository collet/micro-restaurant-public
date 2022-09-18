import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

export class RecipeNotFoundException extends ErrorDto {
  constructor(menuItemShortName: string) {
    super(HttpStatus.NOT_FOUND, 'Recipe not found', `Recipe for "${menuItemShortName}" was not found.`);
  }
}
