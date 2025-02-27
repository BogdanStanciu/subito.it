import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { GetOrder } from './dto/get-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOkResponse({
    type: GetOrder,
    isArray: false,
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order id',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetOrder> {
    return this.ordersService.findOne(id);
  }

  @ApiCreatedResponse({
    isArray: false,
    schema: {
      type: 'string',
      example: '71569bfc-8289-481a-96d3-ead520555da5',
    },
  })
  @Post()
  async create(@Body() order: CreateOrderDto): Promise<GetOrder> {
    return this.ordersService.create(order);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<GetOrder> {
    return this.ordersService.update(id, updateOrderDto);
  }
}
