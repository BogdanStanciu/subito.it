/**
Reasons:

Atomic Operations: Cart operations (add/remove items) can be done in a single operation
Read Performance: You'll typically need to read the entire cart at once
Data Consistency: Cart items are strongly related to the cart itself
Query Simplicity: No need for joins/lookups
*/

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
