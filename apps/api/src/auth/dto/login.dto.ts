import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'pariente' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '$Demo1234' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
