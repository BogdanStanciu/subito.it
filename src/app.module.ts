import { Module } from '@nestjs/common';
import { ItemsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [ItemsModule, OrdersModule],
})
export class AppModule {}
