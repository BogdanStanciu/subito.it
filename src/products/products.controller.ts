import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiResponse({
    type: Product,
    isArray: false,
    status: 201,
    example: {
      name: 'Red apple',
      vat: 0.1,
      price: 10,
      description: 'Red apple',
    },
  })
  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @ApiOkResponse({
    type: Product,
    isArray: true,
    example: [
      {
        product_id: 'b6fe869b-2f4c-4f21-a0f1-24608e82f8a0',
        name: 'Red Apple',
        description: 'Red apple',
        vat: 0.1,
        price: 10,
      },
    ],
  })
  @ApiQuery({ name: 'name', required: false })
  @Get()
  async find(@Query('name') name: string): Promise<Product[]> {
    return this.productsService.find(name);
  }

  @ApiOkResponse({
    type: Product,
    isArray: false,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product not found`);
    }
    return product;
  }

  @ApiBody({
    type: UpdateProductDto,
  })
  @ApiResponse({
    type: Product,
    status: 201,
    example: {
      product_id: 'b6fe869b-2f4c-4f21-a0f1-24608e82f8a0',
      name: 'Red Apple',
      description: 'Red apple',
      vat: 0.1,
      price: 10,
    },
  })
  @HttpCode(201)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, body);
  }

  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    if (!(await this.productsService.delete(id))) {
      throw new NotFoundException('Product not found');
    }
  }
}
