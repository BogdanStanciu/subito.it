import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  providers: [OrdersService],
  controllers: [OrdersController],
  imports: [ProductsModule],
})
export class OrdersModule {}
