import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products/products.service';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let productsService: ProductsService;

  let products = [
    {
      product_id: '123',
      name: 'Red apple',
      description: 'Red apple',
      price: 10,
      vat: 0.1,
    },
    {
      product_id: 'product-a',
      name: 'Product A',
      vat: 0.1,
      price: 2,
      description: 'Product A',
    },
    {
      product_id: 'product-b',
      name: 'Product B',
      vat: 0.1,
      price: 1.5,
      description: 'Product B',
    },
    {
      product_id: 'product-c',
      name: 'Product C',
      vat: 0.1,
      price: 3,
      description: 'Product C',
    },
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: ProductsService,
          useValue: {
            findOne: jest.fn((id: string) =>
              Promise.resolve(
                products.find((p) => p.product_id === id) || undefined,
              ),
            ),
          },
        },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(ordersService).toBeDefined();
    expect(productsService).toBeDefined();
  });

  describe('create', () => {
    it('should create an order', async () => {
      const createOrderDto: CreateOrderDto = {
        order: {
          items: [
            { product_id: '123', quantity: 2 },
            { product_id: '123', quantity: 3 },
          ],
        },
      };

      const result = await ordersService.create(createOrderDto);
      expect(result).toHaveProperty('order_id');
      expect(result.items.length).toBe(1);
      expect(result.items[0].quantity).toBe(5);
      expect(result.order_price).toBe(50);
      expect(result.order_vat).toBe(5);
    });

    it('shoule create an order with multiple items', async () => {
      const createOrderDto: CreateOrderDto = {
        order: {
          items: [
            { product_id: 'product-a', quantity: 1 },
            { product_id: 'product-b', quantity: 5 },
            { product_id: 'product-c', quantity: 1 },
          ],
        },
      };

      const result = await ordersService.create(createOrderDto);
      expect(result).toHaveProperty('order_id');
      expect(result.items.length).toBe(3);
      expect(result.items[1].quantity).toBe(5);
      expect(result.order_price).toBe(12.5);
      expect(result.order_vat).toBe(1.25);
    });
  });

  it('should throw error if product does not exist', async () => {
    const createOrderDto: CreateOrderDto = {
      order: {
        items: [{ product_id: '999', quantity: 1 }],
      },
    };

    jest.spyOn(productsService, 'findOne').mockResolvedValue(undefined);

    await expect(ordersService.create(createOrderDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  describe('findOne', () => {
    it('should return an order', async () => {
      const orderId = 'order-1';

      ordersService['ordersDatabase'] = [
        { order_id: orderId, items: [{ product_id: '123', quantity: 2 }] },
      ];

      jest.spyOn(productsService, 'findOne').mockResolvedValue({
        product_id: '123',
        price: 10,
        vat: 0.1,
        name: 'Red apple',
        description: 'Red apple',
      });

      const result = await ordersService.findOne(orderId);
      expect(result.order_id).toBe(orderId);
      expect(result.order_price).toBe(20);
      expect(result.order_vat).toBe(2);
    });

    it('should throw error if order does not exist', async () => {
      await expect(ordersService.findOne('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update an order successfully', async () => {
      const orderId = 'order-1';

      ordersService['ordersDatabase'] = [
        { order_id: orderId, items: [{ product_id: '123', quantity: 2 }] },
      ];

      const updateOrderDto: UpdateOrderDto = {
        order: { items: [{ product_id: '123', quantity: 5 }] },
      };

      jest.spyOn(productsService, 'findOne').mockResolvedValue({
        product_id: '123',
        price: 10,
        vat: 0.1,
        name: 'Red apple',
        description: 'Red apple',
      });

      const result = await ordersService.update(orderId, updateOrderDto);
      expect(result.items[0].quantity).toBe(5);
      expect(result.order_id).toBe(orderId);
      expect(result.order_price).toBe(50);
      expect(result.order_vat).toBe(5);
    });

    it('should throw error if order does not exist', async () => {
      await expect(
        ordersService.update('invalid-id', {
          order: { items: [{ product_id: '123', quantity: 5 }] },
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw error if products does not exist', async () => {
      const orderId = 'order-1';
      ordersService['ordersDatabase'] = [
        { order_id: orderId, items: [{ product_id: '123', quantity: 2 }] },
      ];

      jest.spyOn(productsService, 'findOne').mockResolvedValue(undefined);

      await expect(
        ordersService.update(orderId, {
          order: { items: [{ product_id: 'invalid-id', quantity: 5 }] },
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete an order successfully', async () => {
      const order = { order_id: 'order-1', items: [] };
      ordersService['ordersDatabase'] = [order];

      const result = await ordersService.delete('order-1');
      expect(result).toBe(true);
      expect(ordersService['ordersDatabase'].length).toBe(0);
    });

    it('should return false if order not found', async () => {
      ordersService['ordersDatabase'] = [];
      const result = await ordersService.delete('non-existent-order');
      expect(result).toBe(false);
    });
  });
});
