import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ItemsController } from './products.controller';

@Module({
  controllers: [ItemsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ItemsModule {}
