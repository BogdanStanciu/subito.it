import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0.01, { message: 'Vat must be at least 0.01' })
  @ApiProperty()
  vat: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  @Min(0.1, { message: 'Price must be at least 0.1' })
  price: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;
}

export { CreateProductDto };
