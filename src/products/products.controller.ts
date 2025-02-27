import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-products.dto';
import { Product } from './schemas/products.schema';
import { UpdateProductDto } from './dto/update-products.dto';

@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ProductsService) {}

  @ApiResponse({
    type: Product,
    isArray: false,
    status: 201,
    example: {
      product_id: 'b6fe869b-2f4c-4f21-a0f1-24608e82f8a0',
      name: 'Red apple',
      vat: 0.1,
      price: 10,
      description: 'Red apple',
    },
  })
  @Post()
  async create(@Body() createItemDto: CreateProductDto): Promise<Product> {
    return this.itemsService.create(createItemDto);
  }

  @ApiOkResponse({
    type: Product,
    isArray: true,
    example: {
      product_id: 'b6fe869b-2f4c-4f21-a0f1-24608e82f8a0',
      name: 'Red Apple',
      description: 'Red apple',
      vat: 0.1,
      price: 10,
    },
  })
  @ApiQuery({ name: 'name', required: false })
  @Get()
  async find(@Query('name') name: string): Promise<Product[]> {
    return this.itemsService.find(name);
  }

  @ApiOkResponse({
    type: Product,
    isArray: false,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    const item = await this.itemsService.findOne(id);
    if (!item) {
      throw new NotFoundException(`Item not found`);
    }
    return item;
  }

  @ApiBody({
    type: UpdateProductDto,
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
  ): Promise<Product> {
    return this.itemsService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    if (!(await this.itemsService.delete(id))) {
      throw new NotFoundException('Item not found');
    }
  }
}
