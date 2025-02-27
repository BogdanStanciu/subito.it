import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateOrderDto } from './create-order.dto';

// class UpdateOrderItemDto {
//   @IsString()
//   @IsNotEmpty()
//   @ApiProperty()
//   @IsUUID()
//   product_id: string;

//   @IsNumber({ allowNaN: false })
//   @Min(1, { message: 'Quantity must be at least 1' })
//   @IsNotEmpty()
//   @ApiProperty({ description: 'Quantity must be at least 1' })
//   quantity: number;
// }

// class UpdateOrderItemsDto {
//   @IsArray()
//   @ValidateNested({ each: true })
//   @ApiProperty({ type: UpdateOrderItemDto, isArray: true, required: false })
//   @Type(() => UpdateOrderItemDto)
//   @ArrayMinSize(1)
//   items: UpdateOrderItemDto[];
// }

// class UpdateOrderDto {
//   @ApiProperty({ type: UpdateOrderItemsDto, isArray: false, required: false })
//   @ValidateNested()
//   @Type(() => UpdateOrderItemsDto)
//   @IsOptional()
//   order?: UpdateOrderItemsDto;
// }
// export { UpdateOrderDto, UpdateOrderItemsDto, UpdateOrderItemDto };

class UpdateOrderDto extends PartialType(CreateOrderDto) {}
export { UpdateOrderDto };
