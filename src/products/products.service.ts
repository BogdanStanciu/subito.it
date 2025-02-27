import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-products.dto';
import { Product } from './schemas/products.schema';
import { v4 as uuidv4 } from 'uuid';
import { UpdateProductDto } from './dto/update-products.dto';

@Injectable()
export class ProductsService {
  private productsDatabase: Product[];

  constructor() {
    this.productsDatabase = [];
  }

  /**
   * Create and return a new product
   * @param {CreateProductDto} createProductDto
   * @returns {Promise<Product>}
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = {
      product_id: uuidv4(),
      ...createProductDto,
    };

    this.productsDatabase.push(product);
    return product;
  }

  /**
   * Fine a single product by id
   * @param {string} id
   * @returns {Promise<Product>}
   */
  async findOne(id: string): Promise<Product | undefined> {
    return this.productsDatabase.find((el) => el.product_id === id);
  }

  /**
   * Return a list of products that match the given name or all the products in the db
   * @param {string} name
   * @returns {Promise<Product[]>}
   */
  async find(name: string): Promise<Product[]> {
    const searchPattern = name?.length
      ? new RegExp(name, 'i')
      : new RegExp('.', 'i');

    return this.productsDatabase.filter((product) =>
      searchPattern.test(product.name),
    );
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const index = this.productsDatabase.findIndex((el) => el.product_id === id);

    if (index === -1) {
      throw new BadRequestException();
    }

    this.productsDatabase[index] = {
      ...this.productsDatabase[index],
      ...updateProductDto,
    };
    return this.productsDatabase[index];
  }

  /**
   * Delete a single product by id
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id: string): Promise<boolean> {
    const index = this.productsDatabase.findIndex((el) => el.product_id === id);

    if (index !== -1) {
      this.productsDatabase.splice(index, 1);
      return true;
    }

    return false;
  }
}
