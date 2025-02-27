import { ApiProperty } from '@nestjs/swagger';

class Product {
  @ApiProperty()
  product_id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ description: 'Vat cost in percent of price' })
  vat: number;

  @ApiProperty()
  description?: string;
}

export { Product };
