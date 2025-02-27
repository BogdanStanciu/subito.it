import { ApiProperty } from '@nestjs/swagger';

class OrderItems {
  @ApiProperty()
  product_id: string;

  @ApiProperty()
  quantity: number;
}

class Order {
  @ApiProperty()
  order_id: string;

  @ApiProperty({ type: () => OrderItems, isArray: true })
  items: OrderItems[];
}

export { Order, OrderItems };
