import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
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
    type: GetOrder,
  })
  @Post()
  async create(@Body() order: CreateOrderDto): Promise<GetOrder> {
    return this.ordersService.create(order);
  }

  @ApiResponse({
    isArray: false,
    type: GetOrder,
    status: 201,
  })
  @HttpCode(201)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<GetOrder> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    if (!this.ordersService.delete(id)) {
      throw new NotFoundException('Order not found');
    }
  }
}
