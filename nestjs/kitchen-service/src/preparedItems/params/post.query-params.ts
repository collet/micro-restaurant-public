import { IsEnum } from 'class-validator';

import { PostEnum } from '../../shared/schemas/post-enum.schema';

export class PostQueryParams {
  @IsEnum(PostEnum)
  post: PostEnum;
}
