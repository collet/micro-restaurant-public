import { IsDateString, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PreparedItemDto {
  @ApiProperty()
  @IsMongoId()
  _id: string;

  @ApiProperty()
  @IsNotEmpty()
  shortName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  shouldStartAt: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  startedAt: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  finishedAt: string;
}
