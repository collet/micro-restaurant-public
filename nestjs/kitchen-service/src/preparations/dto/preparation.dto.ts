import { ArrayNotEmpty, IsArray, IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PreparedItemDto } from './prepared-item.dto';

export class PreparationDto {
  @ApiProperty()
  @IsMongoId()
  _id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  tableNumber: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  shouldBeReadyAt: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  completedAt: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  takenForServiceAt: string;

  @ApiProperty()
  @ArrayNotEmpty()
  @IsArray({ each: true })
  preparedItems: PreparedItemDto[];
}
