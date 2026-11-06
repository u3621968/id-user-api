import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserIdDto {
  @ApiProperty({ example: 'ABC123' })
  @IsString()
  @IsNotEmpty()
  id1: string;

  @ApiProperty({ example: 'XYZ456' })
  @IsString()
  @IsNotEmpty()
  id2: string;
}