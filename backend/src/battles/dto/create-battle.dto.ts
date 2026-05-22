import {
  IsString,
  IsIn,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MonsterSlotDto {
  @IsInt()
  @Min(1)
  monsterId: number;

  @IsString()
  name: string;

  @IsString()
  @IsIn(['f', 'w', 'n', 'l', 'd'])
  elem: string;

  @IsInt()
  @Min(2)
  @Max(5)
  nat: number;
}

export class CreateBattleDto {
  @IsDateString()
  date: string;

  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => MonsterSlotDto)
  att: MonsterSlotDto[];

  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => MonsterSlotDto)
  def: MonsterSlotDto[];

  @IsString()
  @IsIn(['att', 'def'])
  winner: 'att' | 'def';
}
