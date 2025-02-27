import { ApiProperty } from '@nestjs/swagger';
import { Order, OrderItems } from '../schemas/order.schema';

class GetOrderItems extends OrderItems {
  @ApiProperty()
  price: number;

  @ApiProperty()
  vat: number;
}

class GetOrder extends Order {
  @ApiProperty()
  order_price: number;

  @ApiProperty()
  order_vat: number;

  @ApiProperty({ type: () => GetOrderItems, isArray: true })
  items: GetOrderItems[];
}

export { GetOrder, GetOrderItems };
