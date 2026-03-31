import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateIngredientDto {
  @ApiProperty({ example: 'Cebolla' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
