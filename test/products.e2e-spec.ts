import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { CreateProductDto } from 'src/products/dto/create-products.dto';
import { UpdateProductDto } from 'src/products/dto/update-products.dto';

describe('Products Module', () => {
  let app: INestApplication<App>;
  let updateProductId: string;
  let createdProduct: any;

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

  it('/products (POST) → create an product', async () => {
    const newProduct: CreateProductDto = {
      name: 'Green apple',
      vat: 0.1,
      price: 10,
      description: 'Red apple',
    };

    const response = await request(app.getHttpServer())
      .post('/products')
      .send(newProduct)
      .expect(201);

    createdProduct = response.body;

    expect(response.body).toMatchObject(newProduct);
    expect(response.body).toHaveProperty('product_id');
  });

  it('/products (GET) → should return a list of products which contain "green" as a substring', async () => {
    const response = await request(app.getHttpServer())
      .get('/products?name=green')
      .expect(200);

    expect(response.body.legnth).not.toBe(0);
    updateProductId = response.body[0].product_id;
  });

  it('/products (GET) → should return a list of products', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/products/:id (GET) → should return a specific item', async () => {
    const response = await request(app.getHttpServer())
      .get(`/products/${createdProduct.product_id}`)
      .expect(200);

    expect(response.body).toMatchObject(createdProduct);
  });

  it('/products/:id (GET) → should return 404 if item does not exist', async () => {
    await request(app.getHttpServer())
      .get('/products/non-existing-id')
      .expect(404);
  });

  it('/products/:id (PUT) → should update an existing item', async () => {
    const updateData: UpdateProductDto = { price: 15 };

    const response = await request(app.getHttpServer())
      .put(`/products/${createdProduct.product_id}`)
      .send(updateData)
      .expect(201);

    expect(response.body.price).toBe(15);
  });

  it('/products/:id (PUT) → should return 400 because of price to low', async () => {
    const updateData: UpdateProductDto = { price: 0 };

    await request(app.getHttpServer())
      .put(`/products/${createdProduct.product_id}`)
      .send(updateData)
      .expect(400);
  });

  it('/products/:id (DELETE) → should delete an item', async () => {
    await request(app.getHttpServer())
      .delete(`/products/${createdProduct.product_id}`)
      .expect(204);
  });

  it('/products/:id (DELETE) → should return 404 if item is already deleted', async () => {
    await request(app.getHttpServer())
      .delete(`/products/${createdProduct.product_id}`)
      .expect(404);
  });
});
