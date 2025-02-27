import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Orders Module', () => {
  let app: INestApplication<App>;
  let order: any;

  const orderExpect = {
    order_price: 12.5,
    order_vat: 1.25,
    items: [
      {
        quantity: 1,
        price: 2.0,
        vat: 0.2,
      },
      {
        quantity: 5,
        price: 7.5,
        vat: 0.75,
      },
      {
        quantity: 1,
        price: 3.0,
        vat: 0.3,
      },
    ],
  };

  const products = [
    {
      product_id: null,
      name: 'Product A',
      vat: 0.1,
      price: 2,
      description: 'Product A',
    },
    {
      product_id: null,
      name: 'Product B',
      vat: 0.1,
      price: 1.5,
      description: 'Product B',
    },
    {
      product_id: null,
      name: 'Product C',
      vat: 0.1,
      price: 3,
      description: 'Product C',
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/orders (POST) → create a new order', async () => {
    // Insert products
    for (let i = 0; i < products.length; i++) {
      const response = await request(app.getHttpServer())
        .post('/products')
        .send(products[i])
        .expect(201);

      expect(response.body.product_id).toBeDefined();
      products[i]['product_id'] = response.body.product_id;
    }

    // create new order
    const newOrder = {
      order: {
        items: [
          {
            product_id: products[0].product_id,
            quantity: 1,
          },
          {
            product_id: products[1].product_id,
            quantity: 5,
          },
          {
            product_id: products[2].product_id,
            quantity: 1,
          },
        ],
      },
    };

    const response = await request(app.getHttpServer())
      .post('/orders')
      .send(newOrder)
      .expect(201);

    order = response.body;
    expect(order).toMatchObject(orderExpect);
  });

  it('/orders (GET) → get a single order by id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/orders/${order.order_id}`)
      .expect(200);

    expect(response.body).toMatchObject(orderExpect);
  });

  it('/orders (PUT) → update existing order', async () => {
    const updateOrder = {
      order: {
        items: [
          {
            product_id: products[0].product_id,
            quantity: 1,
          },
          {
            product_id: products[1].product_id,
            quantity: 5,
          },
        ],
      },
    };

    const response = await request(app.getHttpServer())
      .put(`/orders/${order.order_id}`)
      .send(updateOrder)
      .expect(201);

    order = response.body;
    expect(order.order_price).toBe(9.5);
    expect(order.order_vat).toBe(0.95);
  });

  it('/orders (DELETE) → delete existing order', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/orders/${order.order_id}`)
      .expect(204);
  });
});
