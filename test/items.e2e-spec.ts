import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { CreateProductDto } from 'src/products/dto/create-products.dto';
import { UpdateProductDto } from 'src/products/dto/update-products.dto';

describe('Items Module', () => {
  let app: INestApplication<App>;
  let updateItemId: string;
  let createdItem: any;

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

  it('/item (POST) → create an item', async () => {
    const newItem: CreateProductDto = {
      name: 'Green apple',
      vat: 0.1,
      price: 10,
      description: 'Red apple',
    };

    const response = await request(app.getHttpServer())
      .post('/items')
      .send(newItem)
      .expect(201);

    createdItem = response.body;

    expect(response.body).toMatchObject(newItem);
    expect(response.body).toHaveProperty('product_id');
  });

  it('/item (GET) → should return a list of items which contain "green" as a substring', async () => {
    const response = await request(app.getHttpServer())
      .get('/items?name=green')
      .expect(200);

    expect(response.body.legnth).not.toBe(0);
    updateItemId = response.body[0].product_id;
  });

  it('/items (GET) → should return a list of items', async () => {
    const response = await request(app.getHttpServer())
      .get('/items')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/items/:id (GET) → should return a specific item', async () => {
    const response = await request(app.getHttpServer())
      .get(`/items/${createdItem.product_id}`)
      .expect(200);

    expect(response.body).toMatchObject(createdItem);
  });

  it('/items/:id (GET) → should return 404 if item does not exist', async () => {
    await request(app.getHttpServer())
      .get('/items/non-existing-id')
      .expect(404);
  });

  it('/items/:id (PUT) → should update an existing item', async () => {
    const updateData: UpdateProductDto = { price: 15 };

    const response = await request(app.getHttpServer())
      .put(`/items/${createdItem.product_id}`)
      .send(updateData)
      .expect(200);

    expect(response.body.price).toBe(15);
  });

  it('/items/:id (PUT) → should return 400 because of price to low', async () => {
    const updateData: UpdateProductDto = { price: 0 };

    await request(app.getHttpServer())
      .put(`/items/${createdItem.product_id}`)
      .send(updateData)
      .expect(400);
  });

  it('/items/:id (DELETE) → should delete an item', async () => {
    await request(app.getHttpServer())
      .delete(`/items/${createdItem.product_id}`)
      .expect(200);
  });

  it('/items/:id (DELETE) → should return 404 if item is already deleted', async () => {
    await request(app.getHttpServer())
      .delete(`/items/${createdItem.product_id}`)
      .expect(404);
  });
});
