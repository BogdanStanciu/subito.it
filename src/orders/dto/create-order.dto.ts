import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  product_id: string;

  @IsNumber({ allowNaN: false })
  @Min(1, { message: 'Quantity must be at least 1' })
  @IsNotEmpty()
  @ApiProperty({ description: 'Quantity must be at least 1' })
  quantity: number;
}

class CreateOrderItemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({ type: CreateOrderItemDto, isArray: true })
  @ArrayMinSize(1)
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

class CreateOrderDto {
  @ApiProperty({ type: CreateOrderItemsDto, isArray: false })
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => CreateOrderItemsDto)
  order: CreateOrderItemsDto;
}
export { CreateOrderDto, CreateOrderItemsDto, CreateOrderItemDto };
