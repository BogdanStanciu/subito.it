import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-products.dto';
import { Product } from './schemas/products.schema';
import { BadRequestException } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-products.dto';

describe('ProductsService', () => {
  let productsService: ProductsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 10,
        vat: 0.1,
      };

      const result = await productsService.create(createProductDto);
      expect(result).toHaveProperty('product_id');
      expect(result).toMatchObject(createProductDto);
    });
  });

  describe('findOne', () => {
    it('should return a product by ID', async () => {
      const product = await productsService.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 10,
        vat: 0.1,
      });

      const foundProduct = await productsService.findOne(product.product_id);

      expect(foundProduct).toBeDefined();
      expect(foundProduct?.product_id).toBe(product.product_id);
    });

    it('should return undefined if product not found', async () => {
      const result = await productsService.findOne('non-existent-id');
      expect(result).toBeUndefined();
    });
  });

  describe('find', () => {
    it('should return matching products', async () => {
      await productsService.create({
        name: 'Apple',
        description: '',
        price: 10,
        vat: 0.1,
      });
      await productsService.create({
        name: 'Orange',
        description: '',
        price: 10,
        vat: 0.1,
      });
      const results = await productsService.find('Apple');
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Apple');
    });
  });
  describe('update', () => {
    it('should update an existing product', async () => {
      const product = await productsService.create({
        name: 'Old Name',
        description: 'Old Description',
        price: 10,
        vat: 0.1,
      });

      const updateDto: UpdateProductDto = { name: 'New Name' };
      const updatedProduct = await productsService.update(
        product.product_id,
        updateDto,
      );

      expect(updatedProduct.name).toBe('New Name');
    });

    it('should throw an error if product not found', async () => {
      await expect(
        productsService.update('invalid-id', { name: 'New Name' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete a product successfully', async () => {
      const product = await productsService.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 10,
        vat: 0.1,
      });

      const result = await productsService.delete(product.product_id);
      expect(result).toBe(true);
      expect(await productsService.findOne(product.product_id)).toBeUndefined();
    });

    it('should return false if product not found', async () => {
      const result = await productsService.delete('non-existent-id');
      expect(result).toBe(false);
    });
  });
});
